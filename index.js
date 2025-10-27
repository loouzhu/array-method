// 初始数组
let myArray = [1, 2, 3, 4, 5];
let currentMethod = "";

// DOM元素
const arrayInput = document.getElementById("arrayInput");
const setArrayBtn = document.getElementById("setArrayBtn");
const originalArray = document.getElementById("originalArray");
const operationBtns = document.querySelectorAll(".operation-btn");
const methodInput = document.getElementById("methodInput");
const paramInput = document.getElementById("paramInput");
const executeBtn = document.getElementById("executeBtn");
const result = document.getElementById("result");
const codeExample = document.getElementById("codeExample");
const explanation = document.getElementById("explanation");
const callInput = document.getElementById("callInput");
const callBtn = document.getElementById("callBtn");
const callResult = document.getElementById("callResult");
const callCodeExample = document.getElementById("callCodeExample");

// 设置初始数组
function setArray() {
  const input = arrayInput.value.trim();
  if (input) {
    myArray = input.split(",").map((item) => {
      const trimmed = item.trim();
      return isNaN(trimmed) ? trimmed : Number(trimmed);
    });
    originalArray.textContent = JSON.stringify(myArray);
  }
  result.innerHTML = "";
  codeExample.textContent = "";
  explanation.textContent = "";
}

// 显示方法输入框
function showMethodInput(method) {
  currentMethod = method;
  methodInput.style.display = "flex";
  paramInput.value = "";
  paramInput.placeholder = getPlaceholder(method);
}

// 根据方法获取输入框占位符
function getPlaceholder(method) {
  switch (method) {
    case "push":
    case "unshift":
      return "输入要添加的元素，多个用逗号分隔";
    case "splice":
      return '格式: 起始索引,删除个数,添加元素 (例如: 1,2,"a","b")';
    case "slice":
      return "格式: 起始索引,结束索引 (例如: 1,3)";
    case "concat":
      return "输入要连接的数组元素，用逗号分隔";
    case "join":
      return "输入分隔符 (默认是逗号)";
    case "filter":
      return "输入条件，如 x=>x>2";
    case "map":
      return "输入映射函数，如 x=>x*2";
    case "reduce":
      return "输入归约函数，如 (acc,cur)=>acc+cur";
    default:
      return "输入参数";
  }
}

// 执行数组方法
function executeMethod() {
  const param = paramInput.value.trim();
  if (!param) return alert("请输入要执行的元素");
  let newArray, returnValue, explanationText, codeText;

  // 保存原始数组用于显示
  const originalArrayCopy = [...myArray];

  try {
    switch (currentMethod) {
      case "push":
        const pushItems = param.split(",").map((item) => {
          const trimmed = item.trim();
          return isNaN(trimmed) ? trimmed : Number(trimmed);
        });
        returnValue = myArray.push(...pushItems);
        newArray = [...myArray];
        explanationText = `push() 方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度。`;
        codeText = `
          let arr = ${JSON.stringify(originalArrayCopy)};
          let newLength = arr.push(${pushItems
            .map((item) => (typeof item === "string" ? `"${item}"` : item))
            .join(", ")});
          arr 现在是 ${JSON.stringify(newArray)}
          newLength 是 ${returnValue}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "pop":
        returnValue = myArray.pop();
        newArray = [...myArray];
        explanationText = `pop() 方法从数组中删除最后一个元素，并返回该元素的值。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
          let lastElement = arr.pop();
          arr 现在是 ${JSON.stringify(newArray)}
          lastElement 是 ${JSON.stringify(returnValue)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "shift":
        returnValue = myArray.shift();
        newArray = [...myArray];
        explanationText = `shift() 方法从数组中删除第一个元素，并返回该元素的值。`;
        codeText = `
          let arr = ${JSON.stringify(originalArrayCopy)};
          let firstElement = arr.shift();
          arr 现在是 ${JSON.stringify(newArray)}
          firstElement 是 ${JSON.stringify(returnValue)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "unshift":
        const unshiftItems = param.split(",").map((item) => {
          const trimmed = item.trim();
          return isNaN(trimmed) ? trimmed : Number(trimmed);
        });
        returnValue = myArray.unshift(...unshiftItems);
        newArray = [...myArray];
        explanationText = `unshift() 方法将一个或多个元素添加到数组的开头，并返回该数组的新长度。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
          let newLength = arr.unshift(${unshiftItems
            .map((item) => (typeof item === "string" ? `"${item}"` : item))
            .join(", ")});
          arr 现在是 ${JSON.stringify(newArray)}
          newLength 是 ${returnValue}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "splice":
        const spliceParams = param.split(",").map((item) => {
          const trimmed = item.trim();
          return isNaN(trimmed) ? trimmed : Number(trimmed);
        });
        const start = spliceParams[0];
        const deleteCount = spliceParams[1] || 0;
        const addItems = spliceParams.slice(2);

        returnValue = myArray.splice(start, deleteCount, ...addItems);
        newArray = [...myArray];
        explanationText = `splice() 方法通过删除或替换现有元素或者原地添加新的元素来修改数组。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
          let removed = arr.splice(${start}, ${deleteCount}${
          addItems.length > 0
            ? ", " +
              addItems
                .map((item) => (typeof item === "string" ? `"${item}"` : item))
                .join(", ")
            : ""
        });
          arr 现在是 ${JSON.stringify(newArray)}
          removed 是 ${JSON.stringify(returnValue)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "slice":
        const sliceParams = param.split(",").map((item) => {
          const trimmed = item.trim();
          return isNaN(trimmed) ? Number(trimmed) : trimmed;
        });
        const begin = sliceParams[0] !== "" ? sliceParams[0] : undefined;
        const end = sliceParams[1] !== "" ? sliceParams[1] : undefined;

        newArray = myArray.slice(begin, end);
        returnValue = newArray;
        explanationText = `slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
            let sliced = arr.slice(${begin !== undefined ? begin : ""}${
          end !== undefined ? ", " + end : ""
        });
        sliced 是 ${JSON.stringify(newArray)}
        原数组 arr 保持不变: ${JSON.stringify(myArray)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "concat":
        const concatItems = param.split(",").map((item) => {
          const trimmed = item.trim();
          return isNaN(trimmed) ? trimmed : Number(trimmed);
        });
        newArray = myArray.concat(concatItems);
        returnValue = newArray;
        explanationText = `concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
            let concatenated = arr.concat([${concatItems
              .map((item) => (typeof item === "string" ? `"${item}"` : item))
              .join(", ")}]);
            // concatenated 是 ${JSON.stringify(newArray)}
            // 原数组 arr 保持不变: ${JSON.stringify(myArray)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "join":
        const separator = param || ",";
        returnValue = myArray.join(separator);
        newArray = [...myArray];
        explanationText = `join() 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
            let joinedString = arr.join("${separator}");
            // joinedString 是 "${returnValue}"
            // 原数组 arr 保持不变: ${JSON.stringify(myArray)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "filter":
        const filterFunc = param || "x => x > 2";
        const filterFunction = new Function("return " + filterFunc)();
        newArray = myArray.filter(filterFunction);
        returnValue = newArray;
        explanationText = `filter() 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
            let filtered = arr.filter(${filterFunc});
            // filtered 是 ${JSON.stringify(newArray)}
            // 原数组 arr 保持不变: ${JSON.stringify(myArray)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "sort":
        if (param) {
          const sortFunc = new Function("return " + param)();
          newArray = [...myArray].sort(sortFunc);
        } else {
          newArray = [...myArray].sort();
        }
        returnValue = newArray;
        explanationText = `sort() 方法用原地算法对数组的元素进行排序，并返回数组。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
          let sorted = arr.sort(${param || ""});
          // sorted 是 ${JSON.stringify(newArray)}
          // 注意: sort() 会改变原数组，这里为了演示使用了副本`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "map":
        const mapFunc = param || "x => x * 2";
        const mapFunction = new Function("return " + mapFunc)();
        newArray = myArray.map(mapFunction);
        returnValue = newArray;
        explanationText = `map() 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
          let mapped = arr.map(${mapFunc});
          // mapped 是 ${JSON.stringify(newArray)}
          // 原数组 arr 保持不变: ${JSON.stringify(myArray)}
          `;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "forEach":
        const forEachFunc = param || "x => console.log(x)";
        const forEachFunction = new Function("return " + forEachFunc)();
        let forEachResult = [];
        myArray.forEach((item, index) => {
          forEachResult.push(forEachFunction(item, index, myArray));
        });
        newArray = [...myArray];
        returnValue = forEachResult;
        explanationText = `forEach() 方法对数组的每个元素执行一次给定的函数。`;
        codeText = `
              let arr = ${JSON.stringify(originalArrayCopy)};
              let results = [];
              arr.forEach(${forEachFunc});
              // 原数组 arr 保持不变: ${JSON.stringify(myArray)}
            `;
        codeExample.style.whiteSpace = "pre-wrap";
        break;

      case "reduce":
        const reduceFunc = param || "(acc, cur) => acc + cur";
        const reduceFunction = new Function("return " + reduceFunc)();
        returnValue = myArray.reduce(reduceFunction);
        newArray = [...myArray];
        explanationText = `reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
            let reduced = arr.reduce(${reduceFunc});
            // reduced 是 ${JSON.stringify(returnValue)}
            // 原数组 arr 保持不变: ${JSON.stringify(myArray)}`;
        codeExample.style.whiteSpace = "pre-wrap";
        break;
    }

    // 更新原数组显示
    originalArray.textContent = JSON.stringify(myArray);

    // 显示结果
    result.innerHTML = `
          <div class="array-display">原数组: ${JSON.stringify(
            originalArrayCopy
          )}</div>
          <div class="array-display">操作后: ${JSON.stringify(newArray)}</div>
          <div>返回值: ${JSON.stringify(returnValue)}</div>
        `;

    codeExample.textContent = codeText;
    explanation.textContent = explanationText;
    paramInput.value = "";
  } catch (error) {
    result.innerHTML = `<div style="color: red;">错误: ${error.message}</div>`;
    codeExample.textContent = "";
    explanation.textContent = "";
  }
}

// 演示call方法
function demonstrateCall() {
  // 使用call方法调用数组的push方法
  const arrayLike = { 0: "a", 1: "b", length: 2 };
  const newLength = Array.prototype.push.call(arrayLike, "c", "d");

  callResult.innerHTML = `
    <p>使用 call() 方法在类数组对象上调用数组的 push 方法:</p>
    <p><div class="array-display">原类数组对象: {0: 'a', 1: 'b', length: 2}</div></p>
    <div class="array-display">调用 push('c', 'd') 后: ${JSON.stringify(
      arrayLike
    )}</div>
    <div>返回值 (新长度): ${newLength}</div>
  `;

  callCodeExample.textContent = `
    使用 call() 在类数组对象上调用数组方法
    let arrayLike = {0: 'a', 1: 'b', length: 2};
    let newLength = Array.prototype.push.call(arrayLike, 'c', 'd');
    arrayLike 现在是 {0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4}
    newLength 是 4
  `;
  callCodeExample.style.whiteSpace = "pre-wrap";
}

// 事件监听
setArrayBtn.addEventListener("click", setArray);

operationBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    showMethodInput(btn.getAttribute("data-method"));
  });
});

executeBtn.addEventListener("click", executeMethod);

// 初始化
setArray();
demonstrateCall();
