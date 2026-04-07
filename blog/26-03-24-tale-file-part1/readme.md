---
  slug: sqlite-on-git-part-1
  tags: [git, zlib, sqlite]
  date: 2026-03-24
  image: https://upload.wikimedia.org/wikipedia/commons/4/42/The_White_Rabbit_%28Tenniel%29_-_The_Nursery_Alice_%281890%29_-_BL.jpg
  authors: [martin-lysk]
  
---

# SQLite on Git, Part I: The .git folder - Falling down the Rabbithole

Join me on a jump right into the rabbit hole on what we find when we look closer at the .git folder. 
We'll explore how git stores your code in `loose objects` and discover a flag in a 30yr old library used by git that could let us run databases inside git.

<!-- truncate -->

## What has happened so far

In the [**prologue**](../26-03-23-ducktales-prologue/readme.md), I explained why random access matters—the ability to read specific parts of files stored in Git without decompressing the entire thing—which is essential for running SQLite databases on top of Git's storage.

Now that we have done the sane reasoning part - let's go crazy.

## How git stores your data - the .git folder

<img align="right" width="250" src="https://upload.wikimedia.org/wikipedia/commons/4/42/The_White_Rabbit_%28Tenniel%29_-_The_Nursery_Alice_%281890%29_-_BL.jpg">

Whether you've been using git for 6 months or 6 years, you've probably never looked inside the `.git` folder. Let's change that.

I assume that you're using Git already. If you want to learn how to use it - you may want to check out https://git-scm.com/learn or [Git Full Course](https://www.youtube.com/watch?v=rH3zE7VlIMs) first. But what you're most likely less familiar with is the `.git` folder that lives in all your repos.

The following section will describe the parts of the .git data structure needed to understand the technique used to enable Random Access. It is inspired by the great work of the [pro git book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) - by Scott Chacon. The parts excerpted and described here should be sufficient to follow me.

If you are firm with git's underlying data structure already - feel free to jump ahead to the compression section.


### Loose objects - a snapshot of the content of the file

One misconception I had for a long time: Git [does NOT store differences, it stores snapshots](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F?.html#_snapshots_not_differences). What does that mean? Whenever you do a commit, git has a copy of the files content at the point of commit. 

Git creates the snapshot to its internal database in the moment when you add the file to the staging area - the action you do before you commit. 

It does that by creating so-called `loose objects`. You find them inside of `.git/objects/` 

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

5. Create a **readme.md** file containing *Hello World*

<details><summary>

`echo -n "Hello World" > readme.md`

</summary>

*(The `-n` flag prevents adding a newline, which would change the hash)*
</details>

You now have a fresh repo with one file that git doesn't know about just yet. A look into the current `.git` folder shows only two folders for now. 

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

7. Now let's take a look at that objects folder again. 

<details><summary>

`ls -1 .git/objects`

</summary>

5e<br>
info<br>
pack
</details>

We see that a new folder `5e` was created - let's look into that one as well. 

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

Cool! So git turned "Hello World" into that weirdly named compressed file.
But here's the problem: if this was a 1GB file, git would still need to decompress
the ENTIRE thing just to read the last byte. Remember the random access problem
from the prologue? That's what we're trying to solve.

Ok we have a weirdly named file with some weird content in it. Let's untangle that.

#### The weird filename - an address for the content of the file

As outlined earlier git has a copy of every state that you commit. It stores the contents addressable by the content. What does that mean? 

In the given case "Hello World" gets a "unique identifier" of 40 characters:
`5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`. Git uses SHA1 - a hash function that's like
a digital fingerprint. Same content = same hash, always. 

`SHA1(Header+"Hello World") -> 5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`

> [!NOTE] We're gonna look into the Header a bit later

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
> Git splits the hash after the first two characters and uses those to distribute the files over subfolders named by those characters. git handles thousands of contents - this trick reduces the number of files per folder by a factor of 256.

#### The weird characters in the file behind the address

Got it - those 40 characters point to that file but those question marks don't look like `Hello World`. The answer is pretty straightforward here - git compresses the data.  

Luckily git comes with a tool to give us the content behind the address.

<details><summary>

`git cat-file -p 5e1c309dae7f45e0f39b1bf3ac3cd9db12e7d689`

</summary>

`Hello World`
</details>

Nice! We see the content of the file `Hello World` again. 

What we learned so far: Git snapshots the state of the file and stores them under the address produced by a function that produces the address using the content. This concept is called "content addressable storage". 

Think of it like a library where books are filed by their ISBN instead of by author.
If you know the ISBN (the hash), you know exactly where to find the book - no catalog
needed! This is the core of how git structures data, and it's brilliant because the
same content always produces the same address.

This means if we have the address of the content (only 40 characters) we can gain access to the content. This is the core piece of git structures data. How git uses the address internally is not important to understand the next steps and we will cover that in a later article. 

## Going one step deeper - how git compresses loose objects

> [!NOTE]
> Want to see how to decompress git objects with JavaScript? Skip this if you don't
> have Node.js - I'll show you the result anyway!


So `git cat-file -p [hash]` provides us with the file content - served directly from the git folder.
This is great - but we want to only read a fraction. Since Git doesn't provide this out of the box let's check out how Git stores the data. 

Git uses zlib to compress – `deflate` – the loose objects (compare [pro-git-book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)).

So let's uncompress (inflate) the object - I'm gonna switch to JavaScript since this is the language most devs will be able to follow, it runs in the browser... many more arguments but the main reason is my Rust skills...

To run this code locally you need to install node [installed](https://nodejs.org/en/download) and pnpm [installed](https://pnpm.io/installation) first.


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

Ok the result `blob 11Hello World` looks way less cryptic. `Hello World` is obviously the content of the file but what is  `blob 11`? That's the **header** - and it's actually structured like this:

`blob 11[null byte]Hello World`

The header tells us two things:

1. **The type of the object**, here `blob` (file content)
2. **The size of the object**, here `11` (11 bytes of content)

Git adds a null byte (an invisible character) after the header to separate it from the actual content. This helps git allocate the right amount of memory and verify integrity when inflating the object.

> [!NOTE]
> git knows 3 other types: `tree`, `commit`, and `tag`. Read more [here](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)

The compression is the reason why reading from the middle or the end of those blobs is not possible. Zlib - the compression algorithm here always deflates from the start to the end and so does inflation work. Git must begin the deflation process always from the start to the point of interest. Since zlib is sequential, partial reads are impossible without decompressing everything up to the bytes you want to read. 

Impossible? Huh - let's google that `random access zlib possible` revealed a very interesting approach by Hengs Li Random [access to zlib compressed files](https://lh3.github.io/2014/07/05/random-access-to-zlib-compressed-files). Turns out Genomic researchers who deal with files >100GB found a way to use a parameter called Z_FULL_FLUSH to deflate data which then allows random seek into the compressed file.

The key insight: `Z_FULL_FLUSH` forces zlib to reset its compression state at regular intervals, creating checkpoints where decompression can start independently—like chapters in a book instead of one continuous stream.

Oh my god... what if I could use the same mechanism with objects in Git?

That's a lead. What followed on this discovery was a sleepless night a deep dive into zLib, an implementation of a block based compression library. 

In [**Part II**](../26-04-01-tale-file-part2/readme.md) we're gonna look behind the curtain - look deeper into zLib, look at the implementation of my [block-based compression library](https://github.com/martin-lysk/talepack/tree/main/packages/zlib-random-access) and use it to random seek into a loose object that is compatible with Git. Stay tuned!

