import { Vector3, Euler, Matrix4 } from "three"

function checkForIE(): boolean {
  return (!!window.MSInputMethodContext && !!(<any>document).documentMode)
}

const $: (arg0: string) => NodeList = document.querySelectorAll.bind(document);
const $0: (arg0: string) => Element = document.querySelector.bind(document);

function putInGui(input: number[], nodeList: Node[], precision: number): void {
  let index = 0;
  for (let node of nodeList) {
    node.textContent = input[index].toFixed(precision);
    index++;
  }
}

function parseElements(nodeList: Node[], output: Vector3 | Euler | Matrix4): boolean {
  const array = nodeList.map((node: Node) => Number((<string>node.textContent).replace(/\s/g, "")));
  if (array.includes(NaN)) return false;
  output.fromArray(array);
  return true;
}

export { $, $0, putInGui, parseElements };
