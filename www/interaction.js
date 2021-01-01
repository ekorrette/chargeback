let player_interaction = {
    'left': 0, 'right': 0, 'up': 0, 'down': 0, 'switch_charge': false,
    'touch': {
        'x': null,
        'y': null
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

        let touch = event.changedTouches[0];
        player_interaction.touch.x = touch.pageX;
        player_interaction.touch.y = touch.pageY;
    }, false);

    document.addEventListener('touchend', (event) => {
        player_interaction.touch.x = null;
        player_interaction.touch.y = null;
    }, false);
}

export {player_interaction, addListeners}