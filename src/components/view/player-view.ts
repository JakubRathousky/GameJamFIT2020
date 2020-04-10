
import { PlayerController } from '../controllers/player-controller';
import { PersonNames } from '../../entities/constants';
import { PersonViewModel } from './person-view';

export class PlayerViewModel extends PersonViewModel {

    constructor() {
        super({
            name: PersonNames.PLAYER,
            controller: PlayerController.name
        });
    }
}