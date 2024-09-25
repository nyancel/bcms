import lib.events.event_db as event_db

def submit_event(event_key, event_body):
    """
    Submits a new event to the event database.
    
    :param event_key: The key or type of event (e.g., 'user-added', 'article-saved')
    :param event_body: The content or details of the event
    :return: The ID of the newly created event
    """
    # Create the event using the event_db module
    new_event = event_db.Event(event_key=event_key, event_body=event_body)
    
    with event_db.Driver.SessionMaker() as session:
        session.add(new_event)
        session.commit()
    
    return new_event.id


def notify_subscribers(key, event_id):
    """
    send a notification to subsrcibers
    """
    pass