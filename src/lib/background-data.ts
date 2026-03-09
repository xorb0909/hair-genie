export const BACKGROUND_PRESETS = [
  {
    id: "minecraft",
    name: "마인크래프트 스타일",
    prompt: `You are a professional photo compositor and concept artist specializing in Minecraft-style world transformation.

FACE & SUBJECT LOCK (HIGHEST PRIORITY — OVERRIDES EVERYTHING ELSE):
The human face in this image is the ANCHOR POINT. Every single pixel of the face must be preserved exactly as-is. Treat the face and the entire subject as a locked, untouchable layer. No style transfer, no texture mapping, no reinterpretation of any kind may be applied to the subject.

PROCESSING ORDER (FOLLOW STRICTLY):
Step 1. Detect and lock the subject — face, hair, body, clothing, accessories. Mark this region as completely frozen.
Step 2. Transform ONLY the pixels outside the subject boundary into Minecraft style.
Step 3. Composite the original, unmodified subject over the transformed background.
Do NOT regenerate, redraw, or reinterpret the subject at any step.

SUBJECT PRESERVATION (ABSOLUTE RULES — NEVER VIOLATE):
- Do NOT alter the subject's face, skin, hair, body, clothing, or accessories in any way
- Do NOT apply pixelation, voxel texture, or block patterns to the subject
- Do NOT change the subject's pose, proportions, scale, or position in the frame
- Do NOT add any Minecraft-style visual treatment to the subject
- The subject must look like a real photograph placed inside a Minecraft world

ENVIRONMENT TRANSFORMATION (APPLY TO EVERYTHING EXCEPT THE SUBJECT):
- Convert all background elements (buildings, ground, sky, trees, props, walls, roads) into Minecraft block equivalents
- Use authentic Minecraft block types: grass blocks (green top, dirt sides), stone bricks, oak/spruce wood planks, sand, gravel, glass panes, leaves
- All blocks must be perfect cubes with 16x16 pixel textures
- Maintain the original spatial layout, depth, and perspective — rebuild the scene in blocks, don't invent a new layout
- Ground must be flat block layers; buildings must be cube-based rectangular structures
- Trees must use Minecraft oak/birch/spruce style: cylindrical log trunk, square leaf clusters
- Sky: Minecraft sky blue with blocky white clouds or pixelated sunset gradient
- Water (if present): flat teal blocks with subtle animated tile appearance
- Add Minecraft ambient lighting: flat, diffuse, no harsh shadows, consistent block face shading

COMPOSITION & TECHNICAL:
- Maintain the exact camera angle, zoom level, and framing from the original photo
- Preserve depth of field — subject in foreground, Minecraft world receding behind
- The boundary between the realistic subject and the Minecraft world must be clean and sharp
- Final image should feel like the subject is physically standing inside a Minecraft world

OUTPUT QUALITY: High resolution, clean block edges, vibrant Minecraft color palette, cinematic composition`,
  },
  {
    id: "lego",
    name: "레고 스타일",
    prompt: `You are a professional photo compositor specializing in LEGO world integration photography.

FACE & SUBJECT LOCK (HIGHEST PRIORITY — OVERRIDES EVERYTHING ELSE):
The human face in this image is the ANCHOR POINT. Every single pixel of the face must be preserved exactly as-is. Treat the face and the entire subject as a locked, untouchable layer. No plastic texture, no toy stylization, no LEGO-style reinterpretation may be applied to the subject under any circumstance.

PROCESSING ORDER (FOLLOW STRICTLY):
Step 1. Detect and lock the subject — face, hair, skin, body, clothing, accessories. Mark this region as completely frozen.
Step 2. Transform ONLY the pixels outside the subject boundary into LEGO style.
Step 3. Composite the original, unmodified subject over the transformed LEGO environment.
Do NOT regenerate, redraw, or reinterpret the subject at any step.

SUBJECT PRESERVATION (ABSOLUTE RULES — NEVER VIOLATE):
- The human subject must remain 100% photorealistic
- Preserve every detail: skin pores, hair strands, eye color, facial features, clothing fabric texture
- Do NOT apply any plastic, glossy toy, or LEGO texture to the subject's skin, hair, or clothes
- Do NOT alter the subject's face, body, pose, or proportions in any way
- The subject should look like a real person photographed inside a LEGO set

OBJECT TRANSFORMATION (ALL NON-SUBJECT ELEMENTS):
- Every object the subject holds or touches must become its LEGO equivalent
- Flowers → LEGO Botanical Collection style: ABS plastic petals, visible brick connectors, glossy stems
- Bags, tools, accessories → rebuilt entirely from LEGO Technic or System bricks
- No real-world objects remain in the scene — everything becomes LEGO

ENVIRONMENT TRANSFORMATION:
- Rebuild the entire background as a LEGO set constructed by a master builder
- Ground: visible LEGO studs on top surface, smooth tiles for flat roads/floors
- Walls and buildings: LEGO System bricks with visible stud grid and seam lines
- Trees and plants: official LEGO foliage pieces — plastic leaf elements, visible injection mold marks, glossy green ABS
- Sky: stylized LEGO backdrop or large flat LEGO panel
- All surfaces must show: realistic ABS plastic reflections, subtle scuff marks and wear, glossy specular highlights

LIGHTING & REALISM:
- Cinematic macro photography lighting style
- Light behaves differently on subject (soft natural skin diffusion) vs LEGO pieces (hard specular plastic highlights)
- Shallow depth of field: subject in sharp focus, LEGO environment slightly blurred at edges

COMPOSITION: Match exact framing and camera angle from the original photo. Subject is the clear focal point.

STRICT NEGATIVES: No real flowers or organic elements in scene. No toy-like skin. No plastic face. No blurred LEGO pieces in foreground.

OUTPUT QUALITY: Ultra-high detail, cinematic LEGO photography realism, seamless subject integration`,
  },
  {
    id: "clay",
    name: "클레이 스타일",
    prompt: `You are a professional stop-motion art director and compositor, specializing in Laika and Aardman-style clay animation worlds.

FACE & SUBJECT LOCK (HIGHEST PRIORITY — OVERRIDES EVERYTHING ELSE):
The human face in this image is the ANCHOR POINT. Every single pixel of the face must be preserved exactly as-is. Treat the face and the entire subject as a locked, untouchable layer. No clay texture, no stop-motion stylization, no smudging or rounding may be applied to the subject under any circumstance.

PROCESSING ORDER (FOLLOW STRICTLY):
Step 1. Detect and lock the subject — face, hair, skin, body, clothing, accessories. Mark this region as completely frozen.
Step 2. Transform ONLY the pixels outside the subject boundary into clay stop-motion style.
Step 3. Composite the original, unmodified subject over the transformed clay environment.
Do NOT regenerate, redraw, or reinterpret the subject at any step.

SUBJECT PRESERVATION (ABSOLUTE RULES — NEVER VIOLATE):
- The main subject must remain 100% photorealistic — no exceptions
- Preserve face, skin texture, hair, clothing, accessories exactly as in the original photo
- Do NOT apply clay texture, smudging, or stop-motion stylization to the subject
- Do NOT alter body proportions, pose, expression, or scale
- Do NOT smooth, cartoon-ify, or digitally retouch the subject's appearance

CLAY WORLD TRANSFORMATION (ALL BACKGROUND & ENVIRONMENT):
- Rebuild every background element as a hand-sculpted clay miniature set
- Buildings, walls, floors, streets → clay-sculpted architecture with visible hand-molding marks
- Ground and roads → textured clay surfaces with subtle roller marks and imperfections
- Trees, plants, grass → clay-formed organic shapes with slightly exaggerated chunky forms
- Vehicles, signs, furniture, props → clay miniatures with rounded edges and simplified forms
- Sky and clouds → stylized clay backdrop or painted clay sky panel

CLAY TEXTURE DETAILS (CRITICAL FOR AUTHENTICITY):
- Visible fingerprint smudges and thumb impressions on surfaces
- Tool marks from sculpting tools (ridges, scraping lines)
- Subtle seam lines where separate clay pieces were joined
- Slight asymmetry and imperfection — nothing is perfectly straight or smooth
- Rounded, chunky edges throughout — no sharp or digitally precise lines

LIGHTING & ATMOSPHERE:
- Stop-motion studio lighting: soft directional key light, gentle fill light, subtle rim light
- Matte clay surfaces — minimal gloss unless depicting wet clay
- Soft shadows with slight falloff consistent with small-scale set lighting
- Warm, slightly desaturated color palette typical of Laika films

VISUAL CONTRAST (ESSENTIAL):
- Strong visual contrast between the photorealistic subject and the clay environment
- Subject must feel "placed inside" the clay world, not merged with it
- Clean compositing edge between subject and clay background

COMPOSITION: Match original camera angle, framing, and perspective exactly.

STRICT NEGATIVES: No stylization on subject. No cartoon or clay texture on skin or hair. No CGI plastic look. No voxel, LEGO, or pixel styles.

OUTPUT QUALITY: High detail, cinematic stop-motion realism, Laika/Aardman production quality`,
  },
  {
    id: "sims",
    name: "심즈 스타일",
    prompt: `You are a professional photo compositor and game environment artist specializing in The Sims 4 visual style.

FACE & SUBJECT LOCK (HIGHEST PRIORITY — OVERRIDES EVERYTHING ELSE):
The human face in this image is the ANCHOR POINT. Every single pixel of the face must be preserved exactly as-is. Treat the face and the entire subject as a locked, untouchable layer. No game engine rendering, no cel shading, no Sims-style reinterpretation may be applied to the subject under any circumstance.

PROCESSING ORDER (FOLLOW STRICTLY):
Step 1. Detect and lock the subject — face, hair, skin, body, clothing, accessories. Mark this region as completely frozen.
Step 2. Transform ONLY the pixels outside the subject boundary into The Sims 4 style.
Step 3. Composite the original, unmodified subject over the transformed Sims environment.
Do NOT regenerate, redraw, or reinterpret the subject at any step.

SUBJECT PRESERVATION (ABSOLUTE RULES — NEVER VIOLATE):
- The main subject must remain 100% photorealistic
- Preserve face, skin, hair, clothing, accessories, and body exactly as photographed
- Do NOT apply game engine rendering, cel shading, or Sims-style stylization to the subject
- Do NOT alter pose, expression, proportions, or position
- Do NOT add a plumbob above the subject's head

ENVIRONMENT TRANSFORMATION (THE SIMS 4 STYLE):
Architecture:
- Clean, slightly simplified geometry with smooth surface finish
- Walls with subtle painted texture, large windows with slight plastic-like frames
- Roofs with consistent tile or flat patterns

Interior (if applicable):
- Furniture rebuilt in Sims catalog style: clean edges, slight cartoonish proportions
- Floors with visible but simplified tile or wood plank patterns
- Walls with Sims-style paint or wallpaper texture

Exterior (if applicable):
- Neighborhood lot aesthetic: neat sidewalks, trimmed hedges, mailbox
- Trees and plants as official Sims foliage objects — slightly stylized, not hyper-realistic
- Sky: Sims-style gradient sky with soft, rounded clouds

LIGHTING & ATMOSPHERE:
- Soft global illumination typical of Sims 4 gameplay mode
- No harsh shadows — even, bright, slightly diffused lighting
- Slight plastic-like light reflection on surfaces

VISUAL CONTRAST:
- Clear distinction between photorealistic subject and Sims-style environment
- Clean compositing edge — no blending or color spill between subject and environment

COMPOSITION: Preserve original camera angle, framing, and depth exactly.

STRICT NEGATIVES: No pixel art. No voxel, LEGO, Minecraft, or clay styles. No anime or hand-drawn look. No stylization on the subject. No plumbob.

OUTPUT QUALITY: High resolution, The Sims 4 game engine fidelity, seamless subject integration`,
  },
  {
    id: "pastel",
    name: "파스텔 일러스트 스타일",
    prompt: `You are a professional mixed-media illustrator specializing in pastel cartoon overlay art and hand-drawn animation backgrounds.

FACE & SUBJECT LOCK (HIGHEST PRIORITY — OVERRIDES EVERYTHING ELSE):
The human face in this image is the ANCHOR POINT. Every single pixel of the face must be preserved exactly as-is. Treat the face and the entire subject as a locked, untouchable layer. No illustration style, no pastel filter, no cartoon reinterpretation may be applied to the subject under any circumstance.

PROCESSING ORDER (FOLLOW STRICTLY):
Step 1. Detect and lock the subject — face, hair, skin, body, clothing, accessories. Mark this region as completely frozen.
Step 2. Transform ONLY the pixels outside the subject boundary into pastel illustration style.
Step 3. Composite the original, unmodified subject over the transformed illustrated background.
Do NOT regenerate, redraw, or reinterpret the subject at any step.

SUBJECT PRESERVATION (ABSOLUTE RULES — NEVER VIOLATE):
- The main subject must remain 100% photorealistic
- Preserve face, skin, hair, clothing, and body exactly as in the original photo
- Do NOT apply illustration, cartoon, pastel, or sketch styling to the subject
- Do NOT alter the subject's pose, proportions, or expression

ENVIRONMENT TRANSFORMATION (PASTEL ILLUSTRATION STYLE):
Color Palette:
- Soft pastel tones: mint green, baby blue, blush pink, lavender, buttercream yellow, peach
- Slightly desaturated but vibrant — not neon, not muted
- Warm highlights and cool shadow tones

Line Art:
- Clean, confident hand-drawn outlines (2-4px weight) in dark brown or navy (not black)
- Slightly imperfect, organic line quality — looks drawn by hand, not vector
- All background objects have visible outline strokes

Background Elements:
- Buildings → simplified cartoon architecture with rounded edges and pastel wall colors
- Ground → flat pastel surface with simple texture lines
- Sky → soft gradient pastel sky (pink-to-blue or peach-to-lavender) with hand-drawn fluffy clouds
- Trees and plants → cute rounded cartoon shapes with simple leaf clusters, slightly wobbly outlines
- Props and objects → simplified cartoon versions with clean fills and outlines

Decorative Doodle Overlays:
- Floating hearts, stars (✦), sparkles, and small flower doodles scattered naturally around the scene
- Swirling decorative lines around the subject suggesting energy and life
- Climbing vine doodles on walls or lamp posts
- Tiny dot patterns or hatching for ground shadow areas

LIGHTING & ATMOSPHERE:
- Flat, even illustration lighting — no harsh shadows
- Gentle glow or bloom effect around light sources
- Overall warm, cheerful, storybook atmosphere

VISUAL CONTRAST:
- Strong contrast between photorealistic subject and illustrated environment
- Clean compositing edge around the subject — subject pops out against the illustrated background

COMPOSITION: Match original camera angle and framing exactly.

STRICT NEGATIVES: No stylization on the subject. No anime face proportions. No harsh colors. No digital vector look — must feel hand-drawn.

OUTPUT QUALITY: High resolution, professional children's book illustration quality, warm and charming atmosphere`,
  },
  {
    id: "apocalypse",
    name: "지구 종말 스타일",
    prompt: `You are a professional concept artist and VFX compositor specializing in post-apocalyptic cinematic environments.

FACE & SUBJECT LOCK (HIGHEST PRIORITY — OVERRIDES EVERYTHING ELSE):
The human face in this image is the ANCHOR POINT. Every single pixel of the face must be preserved exactly as-is. Treat the face and the entire subject as a locked, untouchable layer. No color grading, no desaturation, no damage effects, no atmospheric haze may be applied to the subject under any circumstance.

PROCESSING ORDER (FOLLOW STRICTLY):
Step 1. Detect and lock the subject — face, hair, skin, body, clothing, accessories. Mark this region as completely frozen.
Step 2. Transform ONLY the pixels outside the subject boundary into a post-apocalyptic environment.
Step 3. Composite the original, unmodified subject over the transformed apocalyptic background.
Do NOT regenerate, redraw, or reinterpret the subject at any step.

SUBJECT PRESERVATION (ABSOLUTE RULES — NEVER VIOLATE):
- The main subject must remain completely unchanged — face, body, skin tone, hair, clothing, accessories, pose, expression
- Do NOT add dirt, blood, wounds, burns, or damage effects to the subject
- Do NOT change the subject's clothing color or texture
- Do NOT apply any color grading, desaturation, or stylization to the subject
- Do NOT cover or obscure the subject with debris, smoke, or environmental elements

ENVIRONMENT TRANSFORMATION (POST-APOCALYPTIC CINEMATIC):
Architecture & Structures:
- Crumbling concrete buildings with collapsed sections and exposed steel rebar
- Shattered windows with jagged glass edges and dark interiors
- Cracked and broken road surfaces with deep fissures and upheaved asphalt
- Abandoned burned-out vehicles: rusted, window-less, charred shells
- Toppled signage, broken lamp posts, collapsed overpass sections
- Rubble piles of concrete chunks, broken brick, twisted metal debris

Atmosphere & Sky:
- Heavy overcast sky: dark storm clouds, deep grey and bruised purple tones
- Distant horizon glow: orange-red light from unseen fires
- Smoke columns rising from multiple points in the background
- Fine ash particles and dust floating in the air mid-frame
- Volumetric haze and atmospheric fog for environmental depth
- Faint embers drifting upward in background

Ground & Details:
- Ash-covered surfaces with wind-scattered debris
- Broken glass, scattered papers, abandoned personal belongings
- Cracked earth or scorched ground texture

LIGHTING & COLOR:
- Moody, cinematic low-key lighting
- Cool desaturated overall palette with selective warm orange/amber highlights from fire sources
- Deep shadows with subtle blue-grey fill light
- Volumetric light rays through smoke and dust
- Light direction must match the original photo's light source on the subject

COMPOSITING RULES:
- Subject must remain the clear visual focal point
- Nothing overlaps or covers the subject
- Clean, sharp compositing edge around the subject
- No color spill or atmospheric haze affecting the subject's appearance

COMPOSITION: Preserve original camera angle, framing, perspective, and depth of field exactly.

STRICT NEGATIVES: Do not alter the subject in any way. No zombies or monsters. No sci-fi elements. No text or UI. No color grading on the subject. No debris overlapping the subject.

OUTPUT QUALITY: Ultra-realistic, Hollywood VFX quality, cinematic dystopian atmosphere, high detail environmental textures`,
  },
];
