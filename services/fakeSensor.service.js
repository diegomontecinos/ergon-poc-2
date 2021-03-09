"use strict";

const DbMixin = require("../mixins/db.mixin");
const mongoose = require("mongoose");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "fakeSensor",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("fakesensors")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"sensor",
			"data",
            "status"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			sensor: "string|min:3",
		}
	},
    /**
     * Mongoose model for mongo collections 
     */
    model: mongoose.model("Post", mongoose.Schema({
        sensor: { type: String},
        data: {type: Array},
        status: {type: String}
    })),

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			create(ctx) {
				ctx.params.status = "new";
			}
		}
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---


		/**
		 * Decrease the quantity of the product item.
		 */
		decreaseQuantity: {
			rest: "PUT /:id/quantity/decrease",
			params: {
				id: "string",
				value: "number|integer|positive"
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: -ctx.params.value } });
				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			await this.adapter.insertMany([
				{ sensor: "SeedSensor", data: [364,-116,22260,-90,100,-137], status: "seed" },
			]);
		}
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};