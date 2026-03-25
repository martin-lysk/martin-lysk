---
  slug: ducktales-prologue
  tags: [vfs, git, legit]
---

# Ducktales - how to store a sqlite database in git 

## Prologue

In the upcomming series of blogposts I gonna share the results of my research over the last years. The result: A way to enable random read and write access in git's storage.

<!-- truncate -->

Random what? Do you recall the walkman and how much fun it was to find that one track on your mix tape? The Discman (with antishock) is random access.

![The walkman](./walkman-orange.avif)

To Young? You are watching this livestream and you waiting for a specific topic that should get covered today. The recording is random access.

Random access is a core feature of every File system - It allows you to jump to a scene in your Movie (*.mpg file) skim through a huge PDF file and enables Databases like SQLite to return that one row you are interested in from a gigabyte big file even on small devices. 

In git it's only possible to read and write a whole file - if you would want to access only a parts of your file, like skipping to the last chapter of a movie inside of a video file, when stored in git, you have to read the whole file once  - it’s like your Walkmans fast forward button - with a look on the discman's next button - comparable slow. File formats that are designed on the concept of random access have to fall back to the good old "fast" forward button. 

Why would i need a system like git to be capable of Random access in the first place? 

At legit we had the idea to combine the awesome properties of a Filesystem with a solid git backed storage layer.

Read more about this in the write down of the concept of legit:

- Problem https://www.legitcontrol.com/docs/concepts/problem
- Idea https://www.legitcontrol.com/docs/concepts/idea
- Legit https://www.legitcontrol.com/docs/concepts/filesystem-api
- In action https://www.legitcontrol.com/docs/concepts/chat-app
- Beyond your Disc https://www.legitcontrol.com/docs/concepts/user-experience

Turns out the filesystem sees kind of a Renaissance compare:

- Your Company is a Filesystem - https://x.com/mernit/status/2021324284875153544
and 
- Your company is not a filesystem https://x.com/anvisha/status/2022062725354967551

But Filesystems need a `blockstorage` that enables `random access` and here we are - in a deeep rabithol involving a look at nucleotide sequence alignments to find a flag in a thirdy year old spec of a widely used Compression algorythem and undusting nerdy conversation histories from the master linus torvalds and the maintainers of git.

If this sounds interesting - stay tuned. 
