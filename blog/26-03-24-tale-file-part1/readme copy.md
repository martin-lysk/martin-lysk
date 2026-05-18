---
  slug: git-as-filesystem-part1
  tags: [git, legit, zlib]
---

# Using .git folder as a Versioned Filesystem - Part I
 
This is the first of a serie of articles outlining my research to optimize **read** ***and*** **write** access in git's storage layer to allow versioning of Sqlite files, Word files and what not 
With our work on legit-control.com we focused on the interface layer and left the most intersting parts in the drawer. 
While git is widely known to not be best buddy with binary files 


- Prologue
    - git as an enabler for AI
    - where this is needed  
        - sqlite
        - large files
- Chapter 1 - git as a filesystem
    - From an observer pattern to a filesystem
    - the beauty of the filesystem api
        - well known 
        - general io 
    - the missing elements of a filesystem
- Chapter 2 - Random access for reads on gits objects
   - what is a loose object in git
        - structure 
        - the problem with the checkout
        - problem with accessing the last bytes 
        - zlib's z_flush_all
        - building a block reader and writer
- Chapter 3 - Random access for writes how write() relates to deltas
   - 
 
- Chapter 3 - Applying that principle to Pack files
- Chapter 4 - Keeping an index
- Chapter 5 - making the pack file mutable