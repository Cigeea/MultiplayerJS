interface Coord {
    x: number
    y: number
}

type DrawEvent =
    | PencilEvent
    | BucketFillEvent
    | RectangleEvent

interface PencilEvent {
    type: 'pencil'
    from: Coord
    to: Coord
    color: string
}

interface BucketFillEvent {
    type: 'bucket'
    coord: Coord
    color: string
}

interface RectangleEvent {
    type: 'rectangle'
    from: Coord
    to: Coord
    color: string
}

function handle(e: DrawEvent) {
    // typeof: number string object
    switch (e.type) {
        case "pencil":
        case "bucket":
        case "rectangle":
    }
}