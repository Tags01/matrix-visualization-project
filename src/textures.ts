import { TextureLoader, MeshStandardMaterial, RepeatWrapping, Texture} from "three"

const textureLoader = new TextureLoader();

const floor = new MeshStandardMaterial({
    map: textureLoader.load(require("url:./assets/floor/Map.jpg"), (texture: Texture) => {
        texture.repeat.set(50, 50);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    normalMap: textureLoader.load(require("url:./assets/floor/Normal.jpg"), (texture: Texture) => {
        texture.repeat.set(50, 50);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    roughnessMap: textureLoader.load(require("url:./assets/floor/Roughness.jpg"), (texture: Texture) => {
        texture.repeat.set(50, 50);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/floor/AO.jpg"), (texture: Texture) => {
        texture.repeat.set(50, 50);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    roughness: 0.95,
});

const wood = new MeshStandardMaterial({
    map: textureLoader.load(require("url:./assets/wood/Map.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    normalMap: textureLoader.load(require("url:./assets/wood/Normal.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    roughnessMap: textureLoader.load(require("url:./assets/wood/Roughness.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/wood/AO.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    roughness: 1.00,
});

const nylon = new MeshStandardMaterial({
    map: textureLoader.load(require("url:./assets/nylon/Map.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    normalMap: textureLoader.load(require("url:./assets/nylon/Normal.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    roughnessMap: textureLoader.load(require("url:./assets/nylon/Roughness.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/nylon/AO.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    roughness: 1.00,
});

const water = new MeshStandardMaterial({
    map: textureLoader.load(require("url:./assets/mineral/Map.jpg"), (texture: Texture) => {
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    normalMap: textureLoader.load(require("url:./assets/mineral/Normal.jpg"), (texture: Texture) => {
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/mineral/AO.jpg"), (texture: Texture) => {
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    bumpMap: textureLoader.load(require("url:./assets/mineral/Displacement.png"), (texture: Texture) => {
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    displacementScale: 0.05 
});

export { floor, wood, nylon, water}


