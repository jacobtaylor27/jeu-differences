import { Component, HostListener, OnInit } from '@angular/core';
import { ChatMessage } from '@app/interfaces/chat-message';
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    messages: ChatMessage[];
    isAdversaryConnected: boolean;
    message: string;

    @HostListener('window:keyup', ['$event'])
    onDialogClick(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClickSend();
        }
    }
    ngOnInit(): void {
        this.isAdversaryConnected = false;
        this.messages = [
            { content: 'Salut', type: 'adversary' },
            { content: 'Je mappelle Thierry', type: 'adversary' },
            { content: 'Salut je mappel jean-marc', type: 'personnal' },
            { content: 'La partie va débuter dans 5 minutes', type: 'gameMaster' },
            { content: 'est-ce que taime les echec', type: 'personnal' },
            { content: 'Voici un message sans filtre', type: 'autre' },
            { content: 'On se fait un partie après sur chess.com', type: 'personnal' },
            { content: 'OUais cest good', type: 'adversary' },
            { content: 'La partie va débuter dans 1 minutes', type: 'gameMaster' },
            {
                content: 'Je peux vraiment te dire que ça a été une belle journée, je me suis trouvé un nouveau hobbie aka tailler des citrouilles',
                type: 'adversary',
            },
            { content: 'No way jadore tailler des citrouilles je suis telleent un fan de faire des trucs manuelle', type: 'personnal' },
            { content: 'cest tellement cool', type: 'personnal' },
            { content: 'Invite moi la prochaine fois', type: 'personnal' },
        ];
    }

    onClickSend(): void {
        this.messages.push({ content: this.message, type: 'personnal' });
        this.message = '';
    }
}
