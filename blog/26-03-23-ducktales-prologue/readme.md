---
  slug: sqlite-on-git-prologue
  tags: [vfs, git, sqlite]
  image: ./walkman-orange.jpg
  date: 2026-03-23
  authors: [martin-lysk]
---

# SQLite on Git, Prologue: Why do we need random access in git

In the upcoming series of blogposts I'm going to share the results of my research over the last years.  

**The result:** A way to enable **random read** and **write access** in **git**'s storage, driving a version controlled fs that allows to run versioned sqlite database on top of git's internal storage.

<!-- truncate -->

## Prologue

### Random what? - an analogy
 Do you recall the **walkman** and how much fun it was to find that one track on your mix tape? The **Discman** (with anti-shock ;-) is random access.

![The grandfather of the iPod.](./walkman-orange.jpg)<br/>
Photo by [Florian Schmetz](https://unsplash.com/@floschmaezz) on Unsplash

*Too Young?* You are watching this livestream and you're waiting for a specific topic that should get covered today. The recording is random access.

`Random access` is a core feature of every filesystem - It allows you to jump to your favorite second in a song (*.mp3 file) or a scene in your Movie (*.mpeg file), skim through huge PDF files. It is the primitive that **enables SQLite** – a file based database – to return that one row you are interested in from a gigabyte-sized file even on small devices.

### The Problem - git doesn't have random access

In git it's only possible to read and write a file as a whole - if you would want to access only parts of your file, like skipping to the last chapter of a movie inside of a video file, when stored in git, you have to read the whole file once  - it's like your Walkman's fast forward button - compared to Discman's next button - slow. File formats that are designed on the concept of random access face a bottleneck - and fall back to the good old "fast" forward button. 

### Why Random access in git in the first place?

**The original motivation behind the research:** Sqlite inside git to get a local first, distributed Database with version control. Think of it as [dolt](https://www.dolthub.com/blog/2021-09-17-database-version-control/) but inside of your repository - alongside your code.

> [!Note]
> The need to store structured data in git came from my previous work on Inlang. This involved various crazy approaches like [mergeable file formats](https://www.loom.com/share/6cc974f9045c40bf87c167af30222ee0) in git. We concluded we need a database - and shouldn't reinvent one.

What if you could combine the query capabilities of a database with the version control and distribution of git? What if your SQLite database could live alongside your code, tracked through commits and branches, mergeable and distributable like the rest of your repository?

This requires a filesystem layer backed by **block storage with random access**. Git as a storage layer misses exactly that.

### Can it be added?

This question sent me down a rabbit hole: looking at how researchers in nucleotide sequence alignments deal with a similar problem, finding a flag in a thirty year old spec of a widely used compression algorithm, unearthing nerdy conversation histories from git creator Linus Torvalds and the maintainers of git and a lot of digital duct tape - and finally how this could solve some scaling issues Git faces today.

If this sounds interesting - [follow me 🐇](../26-03-24-tale-file-part1/readme.md). 

<details>
<summary>
Combining a filesystem with a solid git backed storage actually solves a much broader problem. Read more here
</summary>


- Problem https://www.legitcontrol.com/docs/concepts/problem
- Idea https://www.legitcontrol.com/docs/concepts/idea
- Legit https://www.legitcontrol.com/docs/concepts/filesystem-api
- In action https://www.legitcontrol.com/docs/concepts/chat-app
- Beyond your Disc https://www.legitcontrol.com/docs/concepts/user-experience

Turns out the filesystem sees kind of a Renaissance:

- Your Company is a Filesystem - https://x.com/mernit/status/2021324284875153544 and
- Your company is not a filesystem https://x.com/anvisha/status/2022062725354967551

</details>
