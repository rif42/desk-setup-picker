i want multiple setting/background so user can have better feel for their setup environment

maybe use three js to render the items? 

if you want maximum immersion we have to take the pictures of the items on the actual spots then render it using video

# Short Write Up

i just want to say
## Thank you so much for making this awesome test, the job market should follow this kind of test.

also, i forgot to mention that i made apu.ac.id . I think i really nailed the design and narrative there. Please check it out.

User centric means the app is for people who somewhat have decent amount of money, which means their devices arent all potatoes. This frees up the hardware tax, although we're still using the heavy nextjs

This means we have more wiggle room to implement expensive-but-worth-it designs. Initially, i wanted to do a simple three-js models for accurate lighting and detailed model viewing, but i quickly scrapped it bcs there's no way i can finish it in 8 hours.

I want to have decent image quality, but still flexible enough to be swappable. I also want to have multiple office/background to sell the beauty of Bali to customers, and to potentially open partnerships with top tier cafes. But quickly scrapped the idea bcs lighting would be too expensive. Image compositing comes to mind. But pictures are static in terms of angles and sizes. How to combine both worlds?

Image editing is the answer. I admit my work is not the best on this one bcs i used LLM chatbot to generate and edit the images. There are yucky tinting, uneven lighting, weird shadows, chopped background (bcs for some i did it manually).

In real life scenario, i would use specific image editing tools like adobe or comfyUI to facilitate faster and more accurate image generation.

generally, i create the final with all the components in one shot, then use LLM to extract the components one by one (check env-<filename> in public folder), then stitch everything together in the website.

That way, swapping is fast because each img is only 10-50kb, the browser can cache them for faster loading, and it looks decent enough without needing to load a heavy 3d model + custom lighting.

scaling it to mobile devices theoretically would be fine. But since its not on the requirements, i didnt do it.
