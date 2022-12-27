class ActionManager {
    static async execute(action) {
        return action.execute();
    }
}

exports.ActionManager = ActionManager;