---
  slug: ducktales-part-1-random-accessable-blob
  tags: [git, legit, zlib]
---

# TalePack - Part I - Seek into the Rabbithole

This post outlines the way git stores data as `loose objects` and describes how a forgotten flag in Zlib `Z_FULL_FLUSH` can be used to allow seeking into the object and enable block storage like random access.

## What has happened so far

In the prologue I described the reasoning behind all of this - what random access enables and why it would be great to access objects in git without always reading the whole file. 

Now that we have done the sane reasoning part - lets go crazy.

## How git stores your data - the .git folder

I assume that you are using git already. If you want to learn how to use it - you may want to check out https://git-scm.com/learn or [Git Full Course](https://www.youtube.com/watch?v=rH3zE7VlIMs) first. What you're most likely less familiar with is the `.git` folder that lives in all your repos. 

The following section will describe the parts of the .git data structure needed to understand the technique used to enable Random Access. It is inspired by the great work of the [pro git book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) - by Scott Chacon. The parts excerpted and described here should be sufficient to follow me. 

If you are firm with git's underlying data structure already - use random access and seek right into the [rabbit hole](#use-what-is-there---the-zlib-hack).

### Loose object - a snapshot of the content of the file

One misconception I had for a long time: git [does NOT store differences, it stores snapshots](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F?.html#_snapshots_not_differences). What does that mean. Whenever you do a commit, git has a copy of the files content at the point of commit. 

Git creates the snapshot to its internal database in the moment when you add the file to the index - the action you do before you commit. 

It does that by creating so called `loose objects`. You find them inside of `.git/objects/` 

So lets play this through - follow those steps: 

1. Create an empty folder

<details><summary>

`mkdir my_ducktale_test_repo` 

</summary>
</details>

2. Change your working directory into that folder

<details><summary>

cd my_ducktale_test_repo

</summary>
</details>

3. create a new repo 

<details><summary>

`git init`

</summary>
Initialized empty Git repository in /Users/your_user/git_temp/.git/
</details>

4. show folders

<details><summary>

`ls .git/objects` 

</summary>

`total 0`<br>
`drwxr-xr-x  2 your_user  staff    64B Mar 26 07:02 info` <br>
`drwxr-xr-x  2 your_user  staff    64B Mar 26 07:02 pack`  <br>
</details>



4. create a new **readme.md** file containing *Hello World*

<details><summary>

`echo -n "Hello World" > readme.md` 

</summary>
</details>

5. add the readme file 

You have now a fresh repo with one file that git doesn't know about just yet. A look into the current `.git` folder only contains two folders for now. 

<details><summary>

`ls .git/objects` 

</summary>
 info	pack
</details>

6. To make git aware of the readme file we added before we have to add it to git:

<details><summary>

`git add readme.md` 

</summary>
 info	pack
</details>

7. Now let's take a look at that objects folder again 

<details><summary>

`ls .git/objects`

</summary>

`total 0`<br>
`drwxr-xr-x  3 your_user   staff     96 Mar 26 09:48 ba` <br>
`drwxr-xr-x  2 your_user   staff    64B Mar 26 07:02 info` <br>
`drwxr-xr-x  2 your_user   staff    64B Mar 26 07:02 pack`  <br>
</details>

We see that a new Folder `ba` was created - lets look into that one as well: 

<details><summary>

`ls .git/objects/5e`

</summary>

`total 8` <br>
`-r--r--r--  1 your_user   staff  31 Mar 26 09:48 1c309dae7f45e0f39b1bf3ac3cd9db12e7d689` <br>
</details>

What is that wiredly named file? Lets look into it.
<details><summary>

`cat .git/objects/5e/1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`

</summary>

`xK??OR04e?-P?H????/?I?R?`
</details>

Ok we have wiredly named file with some wired content in it. Lets untangle that. 

#### The wired filename - an address for the content of the file

As outlined earlier git has a copy of every state that you commit. It stores the contents addressable by the content. What does that mean? 

In the given case "Hello World" gets an "unique identifier"  of 40 characters here "5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689" Git uses a hash function to produce those 40 characters. In simple terms SHA1 is a function that generates a unique sequence of 40 character that is unique for every possible input. So the function, called with one specific input, here the content of the file X + "Hello World" produces exactly one identifier that no other content will produce and it is allways the same for the given content. We will dive deeper into hashing and the properties of the used "SHA1" later on. 

SHA1(X+Content) -> unique 40 characters. We ignore what X is for now.  

You can generate this unique identifier (hash) yoursself by calling a command in git: 

<details><summary>

`git hash-object readme.md`

</summary>

`5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`
</details>

For git file name doesnt play a role (at that stage). So pipeing the content into gits hash-object function direclty produces the exact same hash.

<details><summary>

`echo -n "Hello World" | git hash-object --stdin`

</summary>

`5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`
</details>

So if we have the content we know its unique identifier (hash) - and if know have the hash of a content - we know path (or address) to find it. The address for "Hello world" is, `5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689` and the path to it is:
".git/objects/**5e**/**1c309dae7f45e0f39b1bf3ac3cd9db12e7d689**".

> [!NOTE]  
> Git stores splitts the hash after the first two characters and uses those to distribute the files over subfolders namded by those characters. git handles thousands of content's this trick reduces the number of files per folders by factor 256

### The wired ? marks and characters in the file behind the adress (not in my head)

Got it - those 40 characters point to that file but those questionsmarks don't look like `Hello World`. The answer is pretty straight foward here - git compresses the data.  

Luckyly git comes with a tool to give us the content behind the address.

<details><summary>

`git cat-file -p 5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`

</summary>

`Hello World`
</details>

Nice! We see the content of the file `Hello World` again. 

What we learned so far: Git snapshots the state of the file and stores them under the address produced by function that produces the adress using the content. This concept is called "content addressable storage". 

This means if we have the adress of the content (only 40 characters) we can gain access to the content. This is the core piece of git strucutres data. How git uses the address internaly is not impoartant to understand the next steps and we will cover that in a later article. 

## How reading of a loose object works and why this is problematic

Git uses zlib to compress – `deflate` – the loose objects (compare [pro-git-book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)).

So lets uncompress (inflate) the object - I gonna switch to Javascript since this is the language most devs will be able to follow, it runs in the browser... many more arguments but the main reason are my rust skill issues...



To run this code locally you got to install node [installed](https://nodejs.org/en/download) amd pnpm [installed](https://pnpm.io/installation) first.


<details><summary>

npx node -e '

```typescript
const { readFileSync } = require("fs");
const { inflateSync } = require("zlib");

const compressedData = readFileSync(".git/objects/5e/1c309dae7f45e0f39b1bf3ac3cd9db12e7d689");

const inflated = inflateSync(compressedData);
console.log(inflated.toString("utf-8"));

```
'

</summary>

`blob 11Hello World`
</details>

Ok the result `blob 11Hello World` looks way less cryptic. `Hello World` is obvious the content of the file but what is  `blob 11` - this is the `X` we didn't touch in [here](todo) before. It is a `header` git adds to the content to describe two additional informations into the header:

1. **The type of the object**, here `blob` - file content 
2. **The size of the object**, git uses this to check integrity of the content and to allocate enought memory when inflating the content.

> [!NOTE] 
> git knows 3 other types `tree`, `commit` and `tag` read more [here](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)

The compression is the reason why reading from the middle or the end of those blobs is not possible. Zlib - the compression algorithem here always deflates from the start to the end and so does inflation work. Git must begin the deflation process always from the start to the point of interest. Since zlib is sequential, partial reads are impossible without decompressing everything up to the bytes you want to read. 

So I have just looked behind the curtain into git's internals - and what I found was the entry into a rabbit hole.

The compression that git uses makes it strictly sequential - or so I thought. Sometimes the best solutions are hiding in plain sight, buried in thirty-year-old documentation and waiting for someone naive enough to continue digging.

In the next article, I will stop by at research in nucleotide sequence alignments where a forgotton mechanismn in zlib's specification enables random access in huge data files and how this can be applied to git's loose objects.k
