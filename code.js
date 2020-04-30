figma.showUI(__html__);
figma.ui.onmessage = msg => {
    if (msg.type === 'create-artboards') {
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
