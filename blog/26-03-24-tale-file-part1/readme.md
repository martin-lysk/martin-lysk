---
  slug: ducktales-part-1-random-accessible-blob
  tags: [git, legit, zlib]
---

**Series: DuckTales - Random Access in Git**
- ← Previous: [Prologue - A Random Success Story](/ducktales-prologue)
- Next: Part 2 (coming soon)

---

# TalePack - Part I - Falling down the Rabbithole

Join me on a jump right into the rabbit hole on what we find when we look closer at the .git folder. This post will outline how git stores data as `loose objects` and how a forgotten flag in a 30yr old library Zlib – `Z_FULL_FLUSH` could  be the key to allow seeking into the object and enable block storage like random access.

## What has happened so far

In the prologue I described the reasoning behind all of this - what random access enables and why it would be great to access objects in git without always reading the whole file. 

Now that we have done the sane reasoning part - let's go crazy.

## How git stores your data - the .git folder

I assume that you are using git already. If you want to learn how to use it - you may want to check out https://git-scm.com/learn or [Git Full Course](https://www.youtube.com/watch?v=rH3zE7VlIMs) first. What you're most likely less familiar with is the `.git` folder that lives in all your repos. 

The following section will describe the parts of the .git data structure needed to understand the technique used to enable Random Access. It is inspired by the great work of the [pro git book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) - by Scott Chacon. The parts excerpted and described here should be sufficient to follow me. 

If you are firm with git's underlying data structure already - feel free to jump ahead to the compression section.

### Loose object - a snapshot of the content of the file

One misconception I had for a long time: git [does NOT store differences, it stores snapshots](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F?.html#_snapshots_not_differences). What does that mean. Whenever you do a commit, git has a copy of the files content at the point of commit. 

Git creates the snapshot to its internal database in the moment when you add the file to the index - the action you do before you commit. 

It does that by creating so called `loose objects`. You find them inside of `.git/objects/` 

So let's play this through - follow those steps: 

1. We create an empty folder

<details><summary>

`mkdir my_ducktale_test_repo` 

</summary>
</details>

2. We change working directory into that folder

<details><summary>

cd my_ducktale_test_repo

</summary>
</details>

3. We create a new repo 

<details><summary>

`git init`

</summary>
Initialized empty Git repository in /Users/your_user/git_temp/.git/
</details>

4. Let's look into the repo's `.git` folder - more specifically into its internal objects folder

<details><summary>

`ls -1 .git/objects`

</summary>

info<br>
pack
</details>

As you can see, there are no objects yet - only the `info` and `pack` directories which are empty placeholders.

5. Create an **readme.md** file containing *Hello World*

<details><summary>

`echo -n "Hello World" > readme.md`

</summary>

*(The `-n` flag prevents adding a newline, which would change the hash)*
</details>

You have now a fresh repo with one file that git doesn't know about just yet. A look into the current `.git` folder only contains two folders for now. 

<details><summary>

`ls -1 .git/objects`

</summary>

info<br>
pack
</details>

6. To make git aware of the readme file we added before we have to add it to git:

<details><summary>

`git add readme.md`

</summary>

*(No output - git add runs silently)*
</details>

7. Now let's take a look at that objects folder again 

<details><summary>

`ls -1 .git/objects`

</summary>

5e<br>
info<br>
pack
</details>

We see that a new folder `5e` was created - let's look into that one as well: 

<details><summary>

`ls -1 .git/objects/5e`

</summary>

1c309dae7f45e0f39b1bf3ac3cd9db12e7d689
</details>

What is that weirdly named file? Let's look into it.
<details><summary>

`cat .git/objects/5e/1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`

</summary>

`xK??OR04e?-P?H????/?I?R?`
</details>

Ok we have a weirdly named file with some weird content in it. Let's untangle that. 

#### The weird filename - an address for the content of the file

As outlined earlier git has a copy of every state that you commit. It stores the contents addressable by the content. What does that mean? 

In the given case "Hello World" gets a "unique identifier" of 40 characters here "5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689" Git uses a hash function to produce those 40 characters. In simple terms SHA1 is a function that generates a unique sequence of 40 characters that is unique for every possible input. So the function, called with one specific input, here the content of the file `(header + "Hello World")` produces exactly one identifier that no other content will produce and it is always the same for the given content. We will dive deeper into hashing and the properties of the used "SHA1" later on. 

SHA1(Header+Content) -> unique 40 characters. We're gonna look at the Header later on.  

You can generate this unique identifier (hash) yourself by calling a command in git: 

<details><summary>

`git hash-object readme.md`

</summary>

`5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`
</details>

For git the file name doesn't play a role (at that stage). So piping the content into git's hash-object function directly produces the exact same hash.

<details><summary>

`echo -n "Hello World" | git hash-object --stdin`

</summary>

`5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`
</details>

So if we have the content we know its unique identifier (hash) - and if we have the hash of a content - we know the path (or address) to find it. The address for "Hello World" is, `5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689` and the path to it is:
".git/objects/**5e**/**1c309dae7f45e0f39b1bf3ac3cd9db12e7d689**".

> [!NOTE]
> Git splits the hash after the first two characters and uses those to distribute the files over subfolders named by those characters. git handles thousands of contents - this trick reduces the number of files per folders by factor 256.

### The weird ? marks and characters in the file behind the address (not in my head)

Got it - those 40 characters point to that file but those question marks don't look like `Hello World`. The answer is pretty straightforward here - git compresses the data.  

Luckily git comes with a tool to give us the content behind the address.

<details><summary>

`git cat-file -p 5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`

</summary>

`Hello World`
</details>

Nice! We see the content of the file `Hello World` again. 

What we learned so far: Git snapshots the state of the file and stores them under the address produced by a function that produces the address using the content. This concept is called "content addressable storage". 

This means if we have the address of the content (only 40 characters) we can gain access to the content. This is the core piece of git structures data. How git uses the address internally is not important to understand the next steps and we will cover that in a later article. 

## How reading of a loose object works and why this is problematic

Git uses zlib to compress – `deflate` – the loose objects (compare [pro-git-book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)).

So let's uncompress (inflate) the object - I'm gonna switch to JavaScript since this is the language most devs will be able to follow, it runs in the browser... many more arguments but the main reason is my Rust skills...



To run this code locally you got to install node [installed](https://nodejs.org/en/download) and pnpm [installed](https://pnpm.io/installation) first.


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

Ok the result `blob 11Hello World` looks way less cryptic. `Hello World` is obviously the content of the file but what is  `blob 11` - this is the **header** we mentioned earlier. It is a `header` git adds to the content to describe two additional pieces of information in the header:

1. **The type of the object**, here `blob` - file content 
2. **The size of the object**, git uses this to check integrity of the content and to allocate enough memory when inflating the content.

> [!NOTE] 
> git knows 3 other types `tree`, `commit` and `tag` read more [here](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)

The compression is the reason why reading from the middle or the end of those blobs is not possible. Zlib - the compression algorithm here always deflates from the start to the end and so does inflation work. Git must begin the deflation process always from the start to the point of interest. Since zlib is sequential, partial reads are impossible without decompressing everything up to the bytes you want to read. 

So I have just looked behind the curtain into git's internals - and what I found was the entry into a rabbit hole.

The compression that git uses makes it strictly sequential - or so I thought. Sometimes the best solutions are hiding in plain sight, buried in thirty-year-old documentation and waiting for someone naive enough to continue digging.

In the next article, I will stop by at research in nucleotide sequence alignments where a forgotten mechanism in zlib's specification enables random access in huge data files and how this can be applied to git's loose objects.
