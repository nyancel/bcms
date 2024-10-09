import * as util from "./util";

type EventListener = {
    callback: (data: any) => void,
    event_type: EventTypeEnum,
    listener_id: string
}

export enum EventTypeEnum {
    DraftsSaved,
    DraftsFetched,
    DraftsChanged,
}

class EventBus {
    listeners: EventListener[] = [];

    on = (event_type: EventTypeEnum, callback: (data: any) => void) => {
        let new_listener: EventListener = { event_type, callback, listener_id: util.random_id() }
        this.listeners.push(new_listener);
        return new_listener;
    }

    clear = (listener_id: string) => {
        for (let index = 0; index < this.listeners.length; index++) {
            if (this.listeners[index].listener_id == listener_id) {
                this.listeners.splice(index, 1);
                break;
            }
        }
    }

    emit = (event_type: EventTypeEnum, data: any) => {
        this.listeners.forEach(listener => {
            if (listener.event_type == event_type) {
                listener.callback(data);
            }
        });
    }
}

export const EVENTBUS = new EventBus();
