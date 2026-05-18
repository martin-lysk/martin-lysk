src gate 

When I started with software development in school the resources that was accessible in the most was Selfhtml - the number one reason I fell in love with the web early. Back than for the every website was source available (for the frontend at least). The comunity around the web had always been a huge driver for open source, extjs was a great example for opensource before I even knew github. An oh man do i miss \<marquee\> and hamsterdance. Enough nostalic booming... Looking into the sources code of the lib you use was like normal, that it meant and how how hard black box bughunting can be I had to learn when later dealing with issues in CoreData on iOS. All the sudden all I had was outdated docs - or information burried somewhere in some WWDC videos without transcript no way to see what happens under the hood. Hunting a bugs without the sourcecode was a long chain of try end error. 

The same is true for agents in the area of AI, your agent is so much more capable when you give it access to the sources of the component you are using. 

Lets say you working on a nodejs server application with a thrid party library like Loro (interchangable with any sdk or lib), while the docs are great and the typescript types and jsdoc gives you a good starting point - ai really accelarates when you just point it to the sources of that lib. 

The solution for me so far: cloning the sources of that lib i am working with in my project and pointing the agent to it `3rd-party-repos/loro`. Over time `3rd-party-repos` became bigger. Beside discspace all those repos took other problems araised: 

1. many projects use the same libs but in different versions

It took me a while just recently to realize this agent was not haluzinating an api, the cloned repo was just in a more recent version.


- [x] motivation
    -  research on github projects without copilot
        - sample questions:
            - tell me where in the git sources zlib is used and how 
            - how does sqlite structure its first page 
    - agents need access to the sources of libs used 
- [ ] short problem
    - agents need access to the sources of libs used


![The grandfather of the iPod.](./Selfhtml-logo.gif)<br/>
Photo by [Florian Schmetz](https://unsplash.com/@floschmaezz) on Unsplash

Problem

Big part of my research is reading code, understanding other repos. 