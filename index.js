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
      return "输入要添加的元素，多个用逗号分隔，默认添加0";
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
      return "输入映射函数，默认 x=>x";
    case "reduce":
      return "格式: 函数,[初始值] 默认(acc,cur)=>acc+cur,0";
    case "pop":
    case "shift":
    case "sort":
    case "forEach":
      return "请勿输入任何参数，调整好数组后直接执行";
    default:
      return "输入参数";
  }
}

// 执行数组方法
function executeMethod() {
  const param = paramInput.value.trim();
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
        try {
          const spliceParams = param
            .split(",")
            .map((item) => {
              const trimmed = item.trim();
              // 检查是否是数字（包括负数）
              if (trimmed === "") return undefined; // 空字符串返回 undefined
              const num = Number(trimmed);
              return isNaN(num) ? trimmed : num;
            })
            .filter((item) => item !== undefined); // 过滤掉空参数

          // 参数验证
          if (spliceParams.length === 0) {
            throw new Error("至少需要提供起始索引");
          }

          const start = spliceParams[0];
          const deleteCount =
            spliceParams[1] !== undefined ? spliceParams[1] : 0;
          const addItems = spliceParams.slice(2);

          // 验证起始索引
          if (typeof start !== "number") {
            throw new Error("起始索引必须是数字");
          }

          // 验证删除数量
          if (typeof deleteCount !== "number" || deleteCount < 0) {
            throw new Error("删除数量必须是非负数字");
          }

          // 处理边界情况
          let adjustedStart = start;
          if (start < 0) {
            adjustedStart = Math.max(myArray.length + start, 0);
          } else if (start > myArray.length) {
            adjustedStart = myArray.length;
          }

          let adjustedDeleteCount = deleteCount;
          if (adjustedStart + deleteCount > myArray.length) {
            adjustedDeleteCount = myArray.length - adjustedStart;
          }

          // 执行 splice 操作
          returnValue = myArray.splice(
            adjustedStart,
            adjustedDeleteCount,
            ...addItems
          );
          newArray = [...myArray];

          explanationText = `splice() 方法通过删除或替换现有元素或者原地添加新的元素来修改数组。`;

          // 生成代码示例
          const addItemsDisplay = addItems.map((item) =>
            typeof item === "string" ? `"${item}"` : item
          );

          let codeParams = `${adjustedStart}, ${adjustedDeleteCount}`;
          if (addItemsDisplay.length > 0) {
            codeParams += `, ${addItemsDisplay.join(", ")}`;
          }

          codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
        let removed = arr.splice(${codeParams});
        // arr 现在是 ${JSON.stringify(newArray)}
        // removed 是 ${JSON.stringify(returnValue)}`;

          codeExample.style.whiteSpace = "pre-wrap";
        } catch (error) {
          result.innerHTML = `<div style="color: red;">splice 错误: ${error.message}</div>
        <div style="margin-top: 10px; color: #666;">正确使用格式:</div>
        <ul style="color: #666; margin-left: 20px;">
            <li><strong>删除元素:</strong> 起始索引,删除个数</li>
            <li><strong>添加元素:</strong> 起始索引,0,元素1,元素2,...</li>
            <li><strong>替换元素:</strong> 起始索引,删除个数,新元素1,新元素2,...</li>
        </ul>
        <div style="margin-top: 10px; color: #666;">示例:</div>
        <ul style="color: #666; margin-left: 20px;">
            <li>1,2 → 从索引1开始删除2个元素</li>
            <li>1,0,"a","b" → 在索引1处插入"a"和"b"</li>
            <li>1,2,"x","y" → 从索引1开始删除2个元素，并插入"x"和"y"</li>
            <li>-2,1 → 从倒数第2个位置删除1个元素</li>
        </ul>`;
          codeExample.textContent = "";
          explanation.textContent = "";
          return;
        }
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
        // 解析输入参数
        const concatItems = [];
        const items = param.split(",");

        for (let i = 0; i < items.length; i++) {
          let trimmed = items[i].trim();

          // 处理数组形式的输入 [x,y,z]
          if (trimmed.startsWith("[") && !trimmed.endsWith("]")) {
            // 开始一个数组，合并后续元素直到找到结束的 ]
            let arrayContent = trimmed.slice(1); // 去掉开头的 [
            while (i < items.length - 1 && !trimmed.endsWith("]")) {
              i++;
              trimmed = items[i].trim();
              arrayContent += "," + trimmed;
            }

            if (arrayContent.endsWith("]")) {
              arrayContent = arrayContent.slice(0, -1); // 去掉结尾的 ]
            }

            // 解析数组内容
            const parsedArray = arrayContent.split(",").map((item) => {
              const trimmedItem = item.trim();
              return isNaN(trimmedItem) ? trimmedItem : Number(trimmedItem);
            });

            concatItems.push(parsedArray);
          } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            // 单个数组元素 [x,y,z]
            const arrayContent = trimmed.slice(1, -1); // 去掉 [ 和 ]
            const parsedArray = arrayContent.split(",").map((item) => {
              const trimmedItem = item.trim();
              return isNaN(trimmedItem) ? trimmedItem : Number(trimmedItem);
            });
            concatItems.push(parsedArray);
          } else {
            // 普通元素
            concatItems.push(isNaN(trimmed) ? trimmed : Number(trimmed));
          }
        }

        // 使用展开运算符处理嵌套数组
        newArray = myArray.concat(...concatItems);
        returnValue = newArray;

        // 生成代码示例
        const concatItemsForDisplay = concatItems.map((item) => {
          if (Array.isArray(item)) {
            return `[${item
              .map((inner) =>
                typeof inner === "string" ? `"${inner}"` : inner
              )
              .join(", ")}]`;
          }
          return typeof item === "string" ? `"${item}"` : item;
        });

        explanationText = `concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。`;
        codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
          let concatenated = arr.concat(${concatItemsForDisplay.join(", ")});
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
        const mapFunc = param || "x=>x";
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
        // 支持格式: 函数,初始值 或 仅函数
        const reduceParams = param.split(",");
        let reduceFunc, initialValue;

        try {
          if (reduceParams.length > 1) {
            // 有初始值的情况 - 需要更智能地分割函数和初始值
            let lastCommaIndex = -1;
            let bracketCount = 0;

            // 遍历字符串，找到最外层的逗号
            for (let i = 0; i < param.length; i++) {
              if (param[i] === "(") bracketCount++;
              else if (param[i] === ")") bracketCount--;
              else if (param[i] === "," && bracketCount === 0) {
                lastCommaIndex = i;
              }
            }

            if (lastCommaIndex !== -1) {
              reduceFunc = param.substring(0, lastCommaIndex).trim();
              initialValue = param.substring(lastCommaIndex + 1).trim();
            } else {
              // 如果没有找到合适的分隔逗号，使用简单分割
              reduceFunc = reduceParams[0].trim();
              initialValue = reduceParams.slice(1).join(",").trim();
            }

            // 设置默认函数
            if (!reduceFunc) reduceFunc = "(acc, cur) => acc + cur";
            if (!initialValue) initialValue = "0";

            // 验证初始值格式
            let parsedInitial;
            try {
              // 尝试解析为数字
              if (!isNaN(initialValue) && initialValue.trim() !== "") {
                parsedInitial = Number(initialValue);
              } else {
                // 检查是否是字符串（用引号包裹）
                const trimmedValue = initialValue.trim();
                if (
                  (trimmedValue.startsWith('"') &&
                    trimmedValue.endsWith('"')) ||
                  (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
                ) {
                  // 去掉引号
                  parsedInitial = trimmedValue.slice(1, -1);
                } else if (trimmedValue === "true") {
                  parsedInitial = true;
                } else if (trimmedValue === "false") {
                  parsedInitial = false;
                } else if (trimmedValue === "null") {
                  parsedInitial = null;
                } else if (trimmedValue === "undefined") {
                  parsedInitial = undefined;
                } else {
                  // 如果不是有效的数字也不是有效的字符串格式，抛出错误
                  throw new Error(
                    `初始值格式不正确: "${initialValue}"。请使用数字或用引号包裹的字符串（如 "hello"）`
                  );
                }
              }
            } catch (initialError) {
              // 在结果区域显示初始值错误
              result.innerHTML = `<div style="color: red;">初始值错误: ${initialError.message}</div>
                <div style="margin-top: 10px; color: #666;">正确示例:</div>
                <ul style="color: #666; margin-left: 20px;">
                    <li>数字: 0, 1, 100</li>
                    <li>字符串: "hello", 'world'</li>
                    <li>布尔值: true, false</li>
                    <li>特殊值: null, undefined</li>
                </ul>`;
              codeExample.textContent = "";
              explanation.textContent = "";
              return; // 直接返回，不继续执行
            }

            // 创建函数
            let reduceFunction;
            try {
              reduceFunction = new Function("return " + reduceFunc)();
            } catch (funcError) {
              // 如果直接解析失败，尝试用括号包裹
              try {
                reduceFunction = new Function("return (" + reduceFunc + ")")();
              } catch {
                result.innerHTML = `<div style="color: red;">函数格式错误: ${reduceFunc}</div>
                    <div style="margin-top: 10px; color: #666;">正确示例:</div>
                    <ul style="color: #666; margin-left: 20px;">
                        <li>(acc, cur) => acc + cur</li>
                        <li>(a, b) => a * b</li>
                        <li>(sum, num) => sum + num</li>
                    </ul>`;
                codeExample.textContent = "";
                explanation.textContent = "";
                return;
              }
            }

            returnValue = myArray.reduce(reduceFunction, parsedInitial);

            codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
            let reduced = arr.reduce(${reduceFunc}, ${
              typeof parsedInitial === "string"
                ? `"${parsedInitial}"`
                : parsedInitial
            });
          // reduced 是 ${JSON.stringify(returnValue)}
          // 原数组 arr 保持不变: ${JSON.stringify(myArray)}`;
          } else {
            // 无初始值的情况
            reduceFunc = param || "(acc, cur) => acc + cur";

            // 创建函数
            let reduceFunction;
            try {
              reduceFunction = new Function("return " + reduceFunc)();
            } catch (funcError) {
              // 如果直接解析失败，尝试用括号包裹
              try {
                reduceFunction = new Function("return (" + reduceFunc + ")")();
              } catch {
                result.innerHTML = `<div style="color: red;">函数格式错误: ${reduceFunc}</div>
                    <div style="margin-top: 10px; color: #666;">正确示例:</div>
                    <ul style="color: #666; margin-left: 20px;">
                        <li>(acc, cur) => acc + cur</li>
                        <li>(a, b) => a * b</li>
                        <li>(sum, num) => sum + num</li>
                    </ul>`;
                codeExample.textContent = "";
                explanation.textContent = "";
                return;
              }
            }

            returnValue = myArray.reduce(reduceFunction);

            codeText = `let arr = ${JSON.stringify(originalArrayCopy)};
          let reduced = arr.reduce(${reduceFunc});
          // reduced 是 ${JSON.stringify(returnValue)}
          // 原数组 arr 保持不变: ${JSON.stringify(myArray)}`;
          }

          newArray = [...myArray];
          explanationText = `reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。`;
          codeExample.style.whiteSpace = "pre-wrap";
        } catch (error) {
          result.innerHTML = `<div style="color: red;">reduce 参数解析错误: ${error.message}</div>`;
          codeExample.textContent = "";
          explanation.textContent = "";
          return;
        }
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
    <br>
    <p>call() 方法改变 this 的指向让 push 方法在 arrayLike 对象上执行，而不是在真正的数组上</p>
    <br>
    <p style="color:red">详细解释：Array是一个构造函数，这个<a href='https://blog.csdn.net/2301_79691283/article/details/151725466?spm=1001.2014.3001.5502'>原型对象</a>有数组的所有方法，这里我们使用push方法。
    同时，call()全写为：call(this.Arg,arg1,arg2...)。所以我们这里的this从之前指向Array.prototype（在原型链上）修改指向为arrayLike，且携带参数('c','d')并使用push方法添加进数组中</p>
    <br>
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

    
    // 使用call()修改this指向的例子
    const person = {
      name: 'Alice',
      greet: function() {
        console.log(Hello, I'm $ {this.name})
      };
    };
    const anotherPerson = {
      name: 'Bob'
    };
    // 正常调用
    person.greet(); // "Hello, I'm Alice"

    // 使用 call 改变 this 指向
    person.greet.call(anotherPerson); // "Hello, I'm Bob"
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

// 初始化弹窗
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("overlay");
  const startBtn = document.getElementById("startBtn");
  const mainContainer = document.getElementById("mainContainer");

  // 点击"开始使用"按钮
  startBtn.addEventListener("click", function () {
    // 隐藏弹窗
    overlay.style.display = "none";
    // 启用页面内容
    mainContainer.classList.remove("disabled");
  });

  // 阻止点击弹窗背景关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      e.stopPropagation();
    }
  });
});
