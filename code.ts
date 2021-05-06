figma.showUI(__html__);
figma.ui.resize(400, 600);

// ------------------
// Helpers
// ------------------
function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

function groupArr(data, n) {
  var group = [];
  for (var i = 0, j = 0; i < data.length; i++) {
    if (i >= n && i % n === 0) j++;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
}

// ------------------
// Main Function
// ------------------
figma.ui.onmessage = (msg) => {
  const selection = figma.currentPage.selection;
  const nodes: SceneNode[] = [];
  const clonedSelection = [...selection];

  const sortedFrames = clonedSelection.sort((a, b) => {
    if (a.y == b.y) return a.x - b.x;
    return a.y - b.y;
  });

  // GET MOCKUP DATA MATCH WITH ID
  // TODO: generate front end using the json mockup and backend get information from front-end
  // console.log(msg.checkedval);
  // console.log(msg.checkedval);
  const { images } = mockupData.find((m) => m.id == msg.checkedval);
  console.log(images);
  let ngroup = images.length;
  const showFrames = msg.showFrames

  // GROUP
  const groupedFrames = groupArr(sortedFrames, ngroup);
  groupedFrames.forEach((screens, index) => {
    // SLIDE PROPRERTIES
    let x = sortedFrames[0].x + (1920 + 200) * index;
    let y = sortedFrames[0].y + 1500;
    const mockupImg = figma.createImage(msg.mockup).hash;

    const slide = createSlide(x, y);
    slide.name = "slide " + index;

    const mockup = createMockup(mockupImg, showFrames);

    // GENERATE IMAGES
    screens.forEach((frame, i) => {
      let { x, y, width, height } = images[i];
      const screenImage = createScreenImage({
        x,
        y,
        width,
        height,
        frame,
      });

      slide.appendChild(screenImage);
    });

    figma.currentPage.appendChild(slide);

    slide.appendChild(mockup);
    nodes.push(slide);
  });

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);

  figma.closePlugin();
};

// -------------------------------
// Reusable functions
// -------------------------------
function createSlide(x, y) {
  const slide = figma.createFrame();
  slide.x = x;
  slide.y = y;
  slide.fills = [
    {
      type: "SOLID",
      color: {
        r: 20 / 256,
        g: 20 / 256,
        b: 20 / 256,
      },
    },
  ];

  slide.resize(1920, 1080);

  return slide;
}

function createMockup(mockupImg, showFrames) {
  const mockup = figma.createRectangle();
  mockup.x = 0;
  mockup.y = 0;
  mockup.opacity = showFrames ? 1 : 0;
  mockup.name = "mockup";
  mockup.resize(1920, 1080);
  mockup.fills = [
    {
      type: "IMAGE",
      imageHash: mockupImg,
      scaleMode: "FIT",
    },
  ];
  mockup.locked = true;

  return mockup;
}

function createScreenImage({ x, y, width, height, frame }) {
  const screenImage = figma.createRectangle();
  screenImage.x = x;
  screenImage.y = y;
  screenImage.name = "screenImage";
  screenImage.resize(width, height);
  const screenImageFills = clone(screenImage.fills);

  // EXPORTING SELECTION
  const exportedImage = frame.exportAsync({
    format: "PNG",
    constraint: {
      type: "SCALE",
      value: 2,
    },
  });

  exportedImage.then((result) => {
    const img = figma.createImage(result);
    screenImageFills[0] = {
      type: "IMAGE",
      imageHash: img.hash,
      scaleMode: "FILL",
    };
    screenImage.fills = screenImageFills;
  });

  return screenImage;
}

// -------------------------------
// Data Structure
// TODO: Add webpack to load external files
// -------------------------------
const mockupData = [
  {
    id: "phone",
    name: "iPhone Zoom",
    category: "iphone",
    mockup:
      "https://res.cloudinary.com/dyw3e3f2c/image/upload/v1588696507/Screeener/2x/mockup-black.png",
    images: [
      {
        x: 713,
        y: 101,
        width: 494,
        height: 878,
      },
    ],
  },
  {
    id: "3phones",
    name: "Three iPhones",
    category: "iphone",
    mockup:
      "https://res.cloudinary.com/dyw3e3f2c/image/upload/v1588696507/Screeener/2x/3-mockups-black.png",
    images: [
      {
        x: 205,
        y: 206,
        width: 375,
        height: 667,
      },
      {
        x: 772,
        y: 206,
        width: 375,
        height: 667,
      },
      {
        x: 1339,
        y: 206,
        width: 375,
        height: 667,
      },
    ],
  },

  //Android
  {
    id: "android",
    name: "Android Zoom",
    category: "android",
    mockup:
      "https://res.cloudinary.com/deeitm141/image/upload/v1597003927/android-zoom_mgork8.png",
    images: [
      {
        x: 718,
        y: 40,
        width: 478,
        height: 1010,
      },
    ],
  },
  {
    id: "3android",
    name: "Three Android",
    category: "android",
    mockup:
      "https://res.cloudinary.com/deeitm141/image/upload/v1597003927/android-triple_a7gk1u.png",
    images: [
      {
        x: 269,
        y: 168,
        width: 360,
        height: 760,
      },
      {
        x: 778,
        y: 168,
        width: 360,
        height: 760,
      },
      {
        x: 1288,
        y: 168,
        width: 360,
        height: 760,
      },
    ],
  },

  //Pixel
  {
    id: "pixel",
    name: "Pixel",
    category: "android",
    mockup:
      "https://res.cloudinary.com/dyw3e3f2c/image/upload/v1601492721/Screeener/2x/pixel-01-1.png",
    images: [
      {
        x: 693,
        y: 64,
        width: 535,
        height: 952,
      },
    ],
  },
  {
    id: "3pixel",
    name: "Three Pixel",
    category: "android",
    mockup:
      "https://res.cloudinary.com/dyw3e3f2c/image/upload/v1601492721/Screeener/2x/pixel-03.png",
    images: [
      {
        x: 228,
        y: 216.32,
        width: 363.8,
        height: 647.36,
      },
      {
        x: 778,
        y: 216.32,
        width: 363.8,
        height: 647.36,
      },
      {
        x: 1328.2,
        y: 216.32,
        width: 363.8,
        height: 647.36,
      },
    ],
  },

  //Iphonex
  {
    id: "iphonex",
    name: "iPhoneX",
    category: "iphone",
    mockup:
      "https://res.cloudinary.com/deeitm141/image/upload/v1606257950/iphonex_qniqkb.png",
    images: [
      {
        x: 714,
        y: 42,
        width: 450,
        height: 972,
      },
    ],
  },
  {
    id: "3iphonex",
    name: "3 iPhoneX",
    category: "iphone",
    mockup:
      "https://res.cloudinary.com/deeitm141/image/upload/v1606257950/iphonex3_gxmfjr.png",
    images: [
      {
        x: 248,
        y: 134,
        width: 375,
        height: 812,
      },
      {
        x: 773,
        y: 134,
        width: 375,
        height: 812,
      },
      {
        x: 1298,
        y: 134,
        width: 375,
        height: 812,
      },
    ],
  },
];
