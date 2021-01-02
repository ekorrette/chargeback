let player_interaction = {
    'left': 0, 'right': 0, 'up': 0, 'down': 0, 'switch_charge': false,
    'touch': {
        'x': null,
        'y': null,
        'single': false
    }
}


const addListeners = (options) => {
    document.addEventListener('keydown', (event) => {
        const key_name = event.key;

        //console.log(key_name);

        switch (key_name) {
            case 'ArrowUp':
                player_interaction.up = 1;
                break;
            case 'ArrowDown':
                player_interaction.down = 1;
                break;
            case 'ArrowLeft':
                player_interaction.left = 1;
                break;
            case 'ArrowRight':
                player_interaction.right = 1;
                break;
            case ' ':
                player_interaction.switch_charge = true;
                break;
            case 'F2':
                options.DEBUG = !options.DEBUG;
        }
    }, false);

    document.addEventListener('keyup', (event) => {
        const key_name = event.key;

        switch (key_name) {
            case 'ArrowUp':
                player_interaction.up = 0;
                break;
            case 'ArrowDown':
                player_interaction.down = 0;
                break;
            case 'ArrowLeft':
                player_interaction.left = 0;
                break;
            case 'ArrowRight':
                player_interaction.right = 0;
                break;
        }
    }, false);

    document.addEventListener('touchstart', (event) => {
        event.preventDefault();
        let touch = event.changedTouches[0];
        player_interaction.touch.x = touch.pageX;
        player_interaction.touch.y = touch.pageY;
        player_interaction.touch.single = true;
    }, false);

    document.addEventListener('touchmove', (event) => {
        event.preventDefault();
        let touch = event.changedTouches[0];
        player_interaction.touch.x = touch.pageX;
        player_interaction.touch.y = touch.pageY;
        player_interaction.touch.single = false;
    }, false);

    document.addEventListener('touchend', (event) => {
        let touch = event.changedTouches[0];
        player_interaction.touch.x = null;
        player_interaction.touch.y = null;
        player_interaction.touch.single = false;
    }, false);
}

export {player_interaction, addListeners}