import { TextureLoader, MeshStandardMaterial, MeshPhongMaterial, RepeatWrapping, Texture} from "three"

const textureLoader = new TextureLoader();

const floor = new MeshPhongMaterial({
    map: textureLoader.load(require("url:./assets/floor/Map.jpg"), (texture: Texture) => {
        texture.repeat.set(50, 50);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/floor/AO.jpg"), (texture: Texture) => {
        texture.repeat.set(50, 50);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
});

const wood = new MeshPhongMaterial({
    map: textureLoader.load(require("url:./assets/wood/Map.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/wood/AO.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    })
});

const nylon = new MeshPhongMaterial({
    map: textureLoader.load(require("url:./assets/nylon/Map.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/nylon/AO.jpg"), (texture: Texture) => {
        texture.repeat.set(0.5, 0.5);
        texture.wrapT = texture.wrapS = RepeatWrapping
    })
});

const water = new MeshPhongMaterial({
    map: textureLoader.load(require("url:./assets/mineral/Map.jpg"), (texture: Texture) => {
        texture.wrapT = texture.wrapS = RepeatWrapping
    }),
    aoMap: textureLoader.load(require("url:./assets/mineral/AO.jpg"), (texture: Texture) => {
        texture.wrapT = texture.wrapS = RepeatWrapping
    })
});

export { floor, wood, nylon, water}


