export const BACKGROUND_PRESETS = [
  {
    id: "minecraft",
    name: "마인크래프트 스타일",
    prompt: `Transform only the background and environment into Minecraft block style. Keep the person's face, body, clothing, pose, and expression EXACTLY the same — do not redraw or alter the person at all. Convert buildings, ground, sky, trees, and objects into Minecraft blocks (grass blocks, stone, wood planks, etc.) with 16x16 pixel textures. Maintain the original camera angle and composition. Output a realistic photo of the person inside a Minecraft world.`,
  },
  {
    id: "lego",
    name: "레고 스타일",
    prompt: `Transform only the background and all objects into LEGO brick constructions. Keep the person's face, body, clothing, pose, and expression EXACTLY the same — do not redraw or alter the person at all. Rebuild the environment using LEGO bricks with visible studs, seam lines, and glossy ABS plastic finish. Objects the person holds should also become LEGO versions. Maintain the original camera angle and composition. Output a realistic photo of the person inside a LEGO world.`,
  },
  {
    id: "clay",
    name: "클레이 스타일",
    prompt: `Transform only the background and environment into a handcrafted clay stop-motion world (Laika/Aardman style). Keep the person's face, body, clothing, pose, and expression EXACTLY the same — do not redraw or alter the person at all. Rebuild buildings, ground, trees, props, and sky as clay miniatures with visible fingerprint marks, tool marks, and imperfect rounded edges. Maintain the original camera angle and composition. Output a realistic photo of the person inside a clay world.`,
  },
  {
    id: "sims",
    name: "심즈 스타일",
    prompt: `Transform only the background and environment into The Sims 4 game world style. Keep the person's face, body, clothing, pose, and expression EXACTLY the same — do not redraw or alter the person at all. Rebuild architecture, furniture, roads, trees, and sky in The Sims 4 aesthetic with clean geometry, soft lighting, and slightly stylized proportions. Do not add a plumbob. Maintain the original camera angle and composition. Output a realistic photo of the person inside a Sims world.`,
  },
  {
    id: "pastel",
    name: "파스텔 일러스트 스타일",
    prompt: `Transform only the background and environment into a hand-drawn pastel illustration world. Keep the person's face, body, clothing, pose, and expression EXACTLY the same — do not redraw or alter the person at all. Convert buildings, sky, ground, trees, and objects into cartoon sketches with soft pastel colors (mint, pink, lavender, baby blue), hand-drawn outlines, and decorative doodles (hearts, stars, sparkles). Maintain the original camera angle and composition. Output a realistic photo of the person inside an illustrated world.`,
  },
  {
    id: "apocalypse",
    name: "지구 종말 스타일",
    prompt: `Transform only the background and environment into a cinematic post-apocalyptic dystopian world. Keep the person's face, body, clothing, pose, and expression EXACTLY the same — do not redraw or alter the person at all. Do not add dirt, damage, or effects to the person. Replace the background with crumbling buildings, rubble, burned vehicles, dark storm clouds, smoke, ash in the air, and distant fire glow. Maintain the original camera angle and composition. Output a realistic photo of the person in a destroyed world.`,
  },
];
