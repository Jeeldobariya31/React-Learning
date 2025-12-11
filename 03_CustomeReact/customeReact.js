const root = document.querySelector("#root");

function customeRender(reactElement, container)
{
  // 1️⃣ Create DOM element from type
  const domElement = document.createElement(reactElement.type);

  // 2️⃣ Set props (attributes, styles, events...)
  if (reactElement.props) {
    Object.keys(reactElement.props).forEach((propName) => {
      const value = reactElement.props[propName];

      // Skip children here (we handle them separately)
      if (propName === "children") return;

      // 🎨 style: object -> set styles
      if (propName === "style" && typeof value === "object") {
        Object.assign(domElement.style, value);
        return;
      }

      // 🎧 event handlers: onClick, onChange, etc.
      if (propName.startsWith("on") && typeof value === "function") {
        const eventName = propName.slice(2).toLowerCase(); // onClick -> click
        domElement.addEventListener(eventName, value);
        return;
      }

      // 🌐 normal attributes: href, target, id, className, etc.
      if (propName === "className") {
        domElement.setAttribute("class", value); // React-style className support
      } else {
        domElement.setAttribute(propName, value);
      }
    });
  }

  // 3️⃣ Handle children (string, number, element, array...)
  const children = reactElement.props?.children ?? reactElement.children;

  function appendChild(child) {
    if (child === null || child === undefined || child === false) {
      return; // skip empty / boolean children
    }

    // Text node
    if (typeof child === "string" || typeof child === "number") {
      const textNode = document.createTextNode(child);
      domElement.appendChild(textNode);
      return;
    }

    // Nested element object -> recursive render
    if (typeof child === "object") {
      customeRender(child, domElement);
    }
  }

  if (Array.isArray(children)) {
    children.forEach(appendChild);
  } else if (children !== undefined) {
    appendChild(children);
  }

  // 4️⃣ Finally append to container
  container.appendChild(domElement);
}

// ---------------- Example usage ----------------

const myele = {
  type: "a",
  props: {
    href: "https://google.com",
    target: "_blank",
    className: "my-link",
    style: {
      color: "white",
      backgroundColor: "black",
      padding: "8px 12px",
      borderRadius: "4px",
      textDecoration: "none",
    },
    onClick: () => {
      console.log("Link clicked!");
    },
    children: "Click me to visit Google",
  },
};

customeRender(myele, root);
