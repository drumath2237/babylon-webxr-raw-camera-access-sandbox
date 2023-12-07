import "./style.scss";
import {
  Engine,
  IWebXRRawCameraAccessOptions,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
  WebXRFeatureName,
  WebXRRawCameraAccess,
} from "@babylonjs/core";

const main = async () => {
  const renderCanvas = document.getElementById(
    "renderCanvas"
  ) as HTMLCanvasElement | null;
  if (!renderCanvas) {
    return;
  }

  // ========sceneの構築========

  const engine = new Engine(renderCanvas, true);
  const scene = new Scene(engine);

  scene.createDefaultCameraOrLight(true, true, true);

  const box = MeshBuilder.CreateBox("box", { size: 0.15 });
  box.position = new Vector3(0, 0, 0.3);

  const material = new StandardMaterial("material", scene);
  box.material = material;

  // ========WebXR機能の実装========

  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "unbounded",
    },
  });
  const sessionManager = xr.baseExperience.sessionManager;
  const featureManager = xr.baseExperience.featuresManager;

  // WebXRRawCameraAccess Featureを初期化・取得
  const rawCameraAccess = featureManager.enableFeature(
    WebXRFeatureName.RAW_CAMERA_ACCESS,
    "latest",
    {} as IWebXRRawCameraAccessOptions
  ) as WebXRRawCameraAccess;

  rawCameraAccess.onTexturesUpdatedObservable.add(() => {
    console.log("texture update!");
    if (rawCameraAccess.texturesData.length !== 0) {
      material.diffuseTexture = rawCameraAccess.texturesData[0];
    }
  });

  sessionManager.onXRFrameObservable.add(() => {
    const intrinsics = rawCameraAccess.cameraIntrinsics;
    if (intrinsics.length !== 0) {
      console.log(rawCameraAccess.cameraIntrinsics);
    }
  });

  window.addEventListener("resize", () => engine.resize());
  engine.runRenderLoop(() => scene.render());
};

main();

