export const BACKGROUND_PRESETS = [
  {
    id: "minecraft",
    name: "마인크래프트 스타일",
    prompt: `Using the provided image, change only the background environment to a Minecraft block-style world. Rebuild everything behind the person — buildings, ground, sky, trees, and props — as authentic Minecraft blocks with 16x16 pixel textures, cubic geometry, and a vibrant Minecraft color palette. Keep the person — face, body, clothing, pose — exactly the same with no changes whatsoever. Preserve the original lighting on the subject and the overall composition and camera angle.`,
  },
  {
    id: "lego",
    name: "레고 스타일",
    prompt: `Using the provided image, change only the background environment and any objects held by the person into a LEGO brick-built world. Rebuild everything behind the person using LEGO System bricks with visible studs, ABS plastic textures, and glossy specular highlights. Any objects the person is holding should also become their LEGO equivalent. Keep the person — face, skin, hair, body, clothing — exactly the same, fully photorealistic with no plastic or toy-like treatment. Preserve the original lighting on the subject and the overall composition and camera angle.`,
  },
  {
    id: "clay",
    name: "클레이 스타일",
    prompt: `Using the provided image, change only the background environment into a handcrafted clay stop-motion world in the style of Laika or Aardman films. Rebuild everything behind the person as hand-sculpted clay miniatures with visible fingerprint smudges, tool marks, rounded chunky edges, and matte clay surfaces. Keep the person — face, skin, hair, body, clothing — exactly the same with no clay texture or stylization applied. Preserve the original lighting on the subject and the overall composition and camera angle.`,
  },
  {
    id: "sims",
    name: "심즈 스타일",
    prompt: `Using the provided image, change only the background environment into a The Sims 4 game world. Rebuild everything behind the person in The Sims 4 aesthetic — clean simplified geometry, smooth surfaces, soft global illumination, bright even lighting, and slightly cartoonish proportions typical of the Sims 4 build mode. Keep the person — face, skin, hair, body, clothing — exactly the same, fully photorealistic with no game-engine stylization applied. Do not add a plumbob. Preserve the original composition and camera angle.`,
  },
  {
    id: "pastel",
    name: "파스텔 일러스트 스타일",
    prompt: `Using the provided image, change only the background environment into a hand-drawn pastel illustration world. Rebuild everything behind the person as a soft pastel cartoon scene — using mint green, baby blue, blush pink, lavender, and peach tones, with hand-drawn outlines in dark brown or navy, fluffy illustrated clouds, rounded cartoon shapes, and decorative doodles like hearts, stars, and sparkles scattered around. Keep the person — face, skin, hair, body, clothing — exactly the same, fully photorealistic with no illustration or pastel filter applied. Preserve the original composition and camera angle.`,
  },
  {
    id: "apocalypse",
    name: "지구 종말 스타일",
    prompt: `Using the provided image, change only the background environment into a cinematic post-apocalyptic world. Rebuild everything behind the person as a dystopian landscape — crumbling concrete buildings with exposed rebar, shattered windows, cracked roads, burned-out vehicles, rubble piles, heavy dark storm clouds, distant fire glow on the horizon, rising smoke columns, and floating ash particles. Keep the person — face, skin, hair, body, clothing — exactly the same with no dirt, damage, color grading, or stylization applied to them. Preserve the original lighting direction on the subject and the overall composition and camera angle.`,
  },
];
