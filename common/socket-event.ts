export enum SocketEvent {
    RefreshGames = 'refreshGames',
    AcceptPlayer = 'acceptPlayer',
    RejectPlayer = 'rejectPlayer',
    PlayerLeft = 'playerLeft',
    Connection = 'connection',
    Disconnect = 'disconnect',
    CreateGame = 'createGame',
    CreateGameMulti = 'createGameMulti',
    GameCreated = 'gameCreated',
    GameDeleted = 'gameDeleted',
    GamesDeleted = 'gamesDeleted',
    RequestToJoin = 'requestToJoin',
    Clock = 'clock',
    Error = 'error',
    JoinGame = 'joinGame',
    WaitPlayer = 'waitPlayer',
    Play = 'play',
    NewGameBoard = 'newGameBoard',
    LeaveGame = 'leaveGame',
    LeaveWaiting = 'leaveWaiting',
    Win = 'win',
    Lose = 'lose',
    DifferenceNotFound = 'differenceNotFound',
    DifferenceFound = 'differenceFound',
    DifferenceFoundMulti = 'differenceFoundMulti',
    Difference = 'difference',
    GetGamesWaiting = 'getGamesWaiting',
    Message = 'message',
    EventMessage = 'eventMessage',
    FetchDifferences = 'fetchDifferences',
    Clue = 'clue',
}
