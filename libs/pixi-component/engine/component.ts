/* eslint-disable @typescript-eslint/no-unused-vars */
import Message from './message';
import Scene from './scene';
import { Container } from './game-object';
import { MessageResponses } from './message';

/**
 * Component that defines a functional behavior of an entity which is attached to
 */
export default class Component<T> {
    private static idCounter = 0;

    // owner object of this component
    owner: Container = null;
    // link to scene
    scene: Scene = null;
    // properties
    props: T;
    // fixed-update frequency each second
    fixedFrequency: number;
    removeWhenFinished = true;
    // number of last update, is set automatically by its owner
    _lastFixedUpdate: number;
    _isFinished = false;

    // auto-incremented id
    protected _id = 0;
    protected _name: string;



    constructor(props: T) {
        this._id = Component.idCounter++;
        this._lastFixedUpdate = 0;
        this.props = props;
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name || this.constructor.name;
    }

    public get isRunning() {
        return !this._isFinished;
    }

    public get isFinished() {
        return this._isFinished;
    }

    /**
     * Called when the component is being added to a new object
     */
    onInit() {
        // override
    }

    /**
     * Called when the component is being added to the scene
     */
    onAttach() {
        // override
    }

    /**
     * Called when the component is being detached from the scene
     */
    onDetach() {
        // override
    }

    /**
     * Handles incoming message
     */
    onMessage(msg: Message) {
        // override
    }

    /**
     * Handles fixed update loop
     * Executed ONLY if frequency is set
     */
    onFixedUpdate(delta: number, absolute: number) {
        // override
    }

    /**
     * Handles update loop
     */
    onUpdate(delta: number, absolute: number) {
        // override
    }

    /**
     * Called before removal from scene
     */
    onRemove() {
        // override
    }

    /**
     * Called after finish()
     */
    onFinish() {
        // override
    }

    /**
     * Subscribes itself as a listener for action with given key
     */
    subscribe(...actions: string[]) {
        for (let action of actions) {
            this.scene._subscribeComponent(action, this);
        }
    }

    /**
     * Unsubscribes itself
     */
    unsubscribe(...actions: string[]) {
        for (let action of actions) {
            this.scene._unsubscribeComponent(action, this);
        }
    }

    /**
     * Sends a message to all subscribers
     */
    sendMessage(action: string, data: any = null): MessageResponses {
        return this.scene.sendMessage(new Message(action, this, this.owner, data));
    }

    /**
     * Detaches component from scene
     */
    finish() {
        if (this.isRunning && this.owner) {
            this.onFinish();
            this._isFinished = true;
            if (this.removeWhenFinished) {
                this.owner.removeComponent(this);
            }
        }
    }
}