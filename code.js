figma.showUI(__html__);
figma.ui.resize(400, 755);
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
function groupArr(data, n) {
    var group = [];
    for (var i = 0, j = 0; i < data.length; i++) {
        if (i >= n && i % n === 0)
            j++;
        group[j] = group[j] || [];
        group[j].push(data[i]);
    }
    return group;
}
figma.ui.onmessage = msg => {
    if (msg.type === 'generate-slides') {
        // 1 PHONE MOCKUP
        if (msg.checkedval === 'phone') {
            const selection = figma.currentPage.selection;
            const nodes = [];
            selection.forEach((element, index) => {
                // SLIDE PROPRERTIES
                const slide = figma.createFrame();
                slide.name = 'slide ' + index;
                slide.x = (1920 + 200) * index;
                slide.y = element.y + 1500;
                slide.resize(1920, 1080);
                const fills = clone(slide.fills);
                const mockupImg = figma.createImage(msg.mockup).hash;
                nodes.push(slide);
                fills[0] = {
                    type: 'IMAGE',
                    imageHash: mockupImg,
                    scaleMode: 'FILL'
                };
                figma.currentPage.appendChild(slide);
                slide.fills = fills;
                const mockup = figma.createRectangle();
                mockup.x = 713;
                mockup.y = 101;
                mockup.resize(494, 878);
                const mockupFills = clone(slide.fills);
                slide.appendChild(mockup);
                // EXPORTING SELECTION
                const exportedImage = element.exportAsync({
                    format: 'PNG',
                    constraint: {
                        type: 'SCALE',
                        value: 2
                    }
                });
                exportedImage
                    .then(result => {
                    const img = figma.createImage(result);
                    mockupFills[0] = {
                        type: 'IMAGE',
                        imageHash: img.hash,
                        scaleMode: 'FILL'
                    };
                    mockup.fills = mockupFills;
                });
            });
            figma.viewport.scrollAndZoomIntoView(nodes);
            figma.closePlugin();
        }
        // 3 PHONES MOCKUP
        if (msg.checkedval === '3phones') {
            const selection = figma.currentPage.selection;
            const nodes = [];
            const groupedFrames = groupArr(selection, 3);
            groupedFrames.forEach((element, index) => {
                const slide = figma.createFrame();
                const fills = clone(slide.fills);
                slide.name = 'slide ' + index;
                slide.x = (1920 + 200) * index;
                slide.y = element[0].y + 1500;
                slide.resize(1920, 1080);
                const mockupImg = figma.createImage(msg.mockup).hash;
                fills[0] = {
                    type: 'IMAGE',
                    imageHash: mockupImg,
                    scaleMode: 'FILL'
                };
                element.forEach((frame, i) => {
                    const mockup = figma.createRectangle();
                    mockup.x = 205 + (568 * i);
                    mockup.y = 206;
                    mockup.resize(375, 667);
                    const mockupFills = clone(slide.fills);
                    slide.appendChild(mockup);
                    // EXPORTING SELECTION
                    const exportedImage = frame.exportAsync({
                        format: 'PNG',
                        constraint: {
                            type: 'SCALE',
                            value: 2
                        }
                    });
                    exportedImage
                        .then(result => {
                        const img = figma.createImage(result);
                        mockupFills[0] = {
                            type: 'IMAGE',
                            imageHash: img.hash,
                            scaleMode: 'FILL'
                        };
                        mockup.fills = mockupFills;
                    });
                });
                figma.currentPage.appendChild(slide);
                slide.fills = fills;
                nodes.push(slide);
            });
            figma.viewport.scrollAndZoomIntoView(nodes);
            figma.closePlugin();
        }
    }
};
