---
  slug: excaliframe-animate-and-export
  tags: [blog, excalidraw, excaliframe, vscode]
  date: 2026-05-02
#   image: ./export.dark.exp.png
---

problem
 - complex structures are hard in textual form, visualizations can help - showing whants happening one step at the time and one step after another is king.
 - during my work on part III of git in sqlite i needed to explain how sqlite uses random access to only access data that is needed at the current time

![Excalidraw demo](./demo.anim.light.exp.svg#gh-light-mode-only)
![Excalidraw demo](./demo.anim.dark.exp.svg#gh-dark-mode-only)

<details>
<summary>Spoil me - what is this all about</summary>

### Excaliframe a vscode extensions to animate and export your Excalidraw frames

![Excalidraw demo](./demo.anim.light.exp.svg)

</details>

<!-- truncate -->

Complex structures are hard to describte in textual form only. Visualizations can help a lot, Static images use arrows and coloring to add a temporal dimension and helped a lot when publishing happened via books. On a blog we can leverage animations to get a real temporal dimension - showing whants happening one step at the time and one step after another is king when it comes to getting complex processes across. 

In one of my recent posts I shared a little tool that allows me to export visuals from excalidraw for my blog. I use it intensivly in articles like [Sqlite in git](../26-04-01-tale-file-part2.dark.exp.svg) and my readers seem to love it. "Hard tobacco textual but your visualizations really made it click " - my 16 year old son reviewing my blogposts <3. 

In an uppcomming post I gonna outline the page based design of sqlite. I explained it verbaly to others with the help of exalidraw again - but the resulting drawings became pretty information dense. What the result is missing is the temporal axis. In the static image all elements are visible at once - the scene is not growing in a logical order. I realized first hand the difference of a dynamic graphic vs. a static image. 

This additional axis helps to reduce the mental work you need to apply to understand whats happening - plus, at least for me, a scene is easier to recall when i see it growing. 

A great example of the use of animations to explain complex topics is [btree explaination from planet scale](https://planetscale.com/blog/btrees-and-database-indexes). I had a pretty abstract concept of btrees in my head - seeing how branches resort after insertation helped me shape a concrete concept that now helps me to recall and apply that knowlege way better.

Lets play It through

Take a second to understand the following visualation of a `select` statment fired against a sqlite database file. Try to grasp going on. If you are a visual person like me - you most likely have scanned the static scene and followed the arrows step by step to understand whats going on. Digesting the graphgic as a whole requires you to find the starting point, decide which arrow to follow, and did you catch that boxes look denser than others and what that means? 

Now click on the play button in the same visualization below. 

The animation makes the scene so much easier to grasp. Even without any textual description some may even understand that during the query only fractions of the file get read and load into memory.

The Problem: I gonna describe a lot of such processes in my upcomming blog posts... Creating such animations can be pretty time consuming. 

The Idea: May I can just use the drawings I already create in excalidraw and animate them in the way i draw them? 

I decided to enrich my excalidraw vscoded extension that already auto export's static svg's for my blog to also allow me to create and export such animations with easy. 


<<

After going viral post on HN and after receiving an unexpected amount of positive feeback - i decided to publish the extension in the vscode market place. Search for Excaliframe and give it a try. 

May I introduce Excaliframe - a visual studio code extension that automaticaly exports 

select * from user -> sqlite -> lookup page1 -> lookup page 200 -> lookup page 110, lookup page 12

Static imange


Animation



The animation allows me to add more information over the time of the process/animation and keep the steps more isolated. 
While the static image is great to rethink the sturcure without the noisy movement - the animation works pretty well to get the overall concept accross. 

So what if i could use - again - my drawings of excalidraw and use animations to redraw the concept in my blog as well? 


A quick ressearch revealed a similiar project - link to project. That allows you to export your excalidraws as animated svg's, it uses the order of the elements beeing drawn in excalidraw to build up the sceen one element at the time. 

This was close but i needed something with a bit more control - plus again - it shoudl integrate nicely in my wrting workflow. 

So here it is SwingDraw - pull exaclibur from the static stone bring your faboluos stories to live with exported animations. 

How it works: 

Each element in excalidraw gets three new custom properties, animationStart, animationDuration, animationType - those get configured with good defaults while you draw in your excalidraw scene. 

If you open up the export and animaiton panel you can now wrap your eleements with an frame with a new property "animate". This will guide the exporter to utilize the animation properties of the containing elements to build a beautiful animated svg. 

It starts with animating the elements in the you drew them onto your excalidraw scene - but if arrows draw to slowly, elements should appear in parallel or you would like to finetune the way it is drawn you can change the animation using a simple animation timeline editor. 


I would argue for most people the animation works better - for those who want to slowly follow the process the static images is less noisy.