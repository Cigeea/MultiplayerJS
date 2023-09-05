import * as ex from "excalibur";

const Images = {
    redSheetImage: new ex.ImageSource("/sprites/character-red-sheet.png"),
    indoorImage: new ex.ImageSource("/maps/indoor.png"),
}

const Sounds = {

}

const loader = new ex.Loader();
loader.suppressPlayButton = true;
const allResources: any = { ...Images, ...Sounds };    //cannot find proper type, ex.Loadable<ex.Resource<?>>
for (const res in allResources) {
    loader.addResource(allResources[res]);
}

export { loader, Images, Sounds };