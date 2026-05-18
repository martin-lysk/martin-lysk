


 - git as a filesystem
 - ai agents 

This makes git impractical think i found a way around that limitation...

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

        -> materializing on the disc (read the blob, write it to disc)

        But there is `git cat-file -p blobhash`

        Describe what it does

        - problem with accessing the last bytes 

        So we can stream the content of the file without storing it on disc. awsome BUT what if i only want to access
        the last bytes. Like in sqlite, if i only want to read a specific page in the 100 mb file or only want to jump to the last minute of a clib? Yes I have to wait for the stream to reach that byte.
        
        Why is it not possible to jump to the position i am intested? 

        The problem: git compresses the object using zlib. 

        The way the compression works (extremly simplified). 
        
        Lets say you have the following content:

        Hello World, Hello World, Hello Mars?

        It starts to read the file and if it finds something that it points to the position.

        Hello World, [0-10] Hello Mars?

        Under the hood its way more complicated - ref zlib article. But this enough to understand the problem.
        Lets say you start reading from the comment foward. You would get [0] Mars - which wont help. 
        So you can only read forwad. 

        Luckily zlib was designed when internet was way worse than today. The poor connection often lead to corrupt data. to be able to partially read zlib has a parameter Z_FULL_FLUSH - the docs also. state random access explicetly.

        >>> If flush is set to Z_FULL_FLUSH, all output is flushed as with Z_SYNC_FLUSH, and the compression state is reset so that decompression can restart from this point if previous compressed data has been damaged or if random access is desired. Using Z_FULL_FLUSH too often can seriously degrade compression.

        Dont google it - this rabbit hole leads to nucleotide sequence alignments where otheres faced this problem in a slightly different env :D But adding random access to a zlib compressed file seem to be solved https://github.com/lh3/lh3.github.com/blob/master/_posts/2014-07-05-random-access-to-zlib-compressed-files.md

        
        What if git is just fine with those flushes? I would be able to use this to read blocks at a specific position... 
        Reading the sources i couldnt find any specfici configuration in the deflate that git uses pretty much standard
        zlib - so lets go. 



        - zlib's z_flush_all

        Wow thats a lead - lets check if an open source lib in js (i write in js/ts so everybody can follow... never #skill issues never) - exists for zlib `pako`. Please Opensource don't die https://www.youtube.com/watch?v=6godSEVvcmU!




        - building a block reader and writer
- Chapter 3 - Random access for writes how write() relates to deltas
   - 
 
- Chapter 3 - Applying that principle to Pack files
- Chapter 4 - Keeping an index
- Chapter 5 - making the pack file mutable