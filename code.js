figma.showUI(__html__);
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
figma.ui.onmessage = msg => {
    if (msg.type === 'generate-slides') {
        const selection = figma.currentPage.selection;
        selection.forEach(element => {
            // SLIDE PROPRERTIES
            const slide = figma.createFrame();
            slide.x = element.x;
            slide.y = element.y + 1000;
            slide.resize(1920, 1080);
            const fills = clone(slide.fills);
            fills[0].color = { r: 0, g: 0, b: 0 };
            figma.currentPage.appendChild(slide);
            slide.fills = fills;
            const mockup = figma.createRectangle();
            mockup.x = 0;
            mockup.y = 0;
            mockup.resize(494, 878);
            const mockupFills = clone(slide.fills);
            slide.appendChild(mockup);
            // EXPORTING SELECTION
            const exportedImage = element.exportAsync();
            console.log(exportedImage);
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
            // SCREEN PROPERTIES
        });
    }
    if (msg.type === 'debug') {
        const selection = figma.currentPage.selection;
        for (let index = 0; index < selection.length; index++) {
            const element = selection[index];
            console.log(element);
        }
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin()
};
