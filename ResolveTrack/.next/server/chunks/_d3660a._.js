module.exports = {

"[project]/utils/db.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__commonjs__external__mongoose__ = __turbopack_external_require__("mongoose", true);
"__TURBOPACK__ecmascript__hoisting__location__";
;
const connect = async ()=>{
    if (__TURBOPACK__commonjs__external__mongoose__["default"].connections[0].readyState) return;
    try {
        await __TURBOPACK__commonjs__external__mongoose__["default"].connect('mongodb://localhost:27017/test', {});
        console.log("Mongo Connection successfully established.");
    } catch (error) {
        throw new Error("Error connecting to Mongoose");
    }
};
const __TURBOPACK__default__export__ = connect;

})()),
"[project]/models/rating.tsx [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__commonjs__external__mongoose__ = __turbopack_external_require__("mongoose", true);
"__TURBOPACK__ecmascript__hoisting__location__";
;
// Create the Rating schema
const RatingSchema = new __TURBOPACK__commonjs__external__mongoose__["Schema"]({
    email: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__commonjs__external__mongoose__["default"].models.Rating || __TURBOPACK__commonjs__external__mongoose__["default"].model('Rating', RatingSchema);

})()),
"[project]/app/api/testimonials/route.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// app/api/display/route.ts
__turbopack_esm__({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$rating$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/models/rating.tsx [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
const GET = async ()=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(); // Assuming connect() establishes the database connection
        const Rating = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$rating$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(); // Fetch all posts from the database
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify(Rating), {
            status: 200
        });
    } catch (error) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](`Error in fetching posts: ${error}`, {
            status: 500
        });
    }
};

})()),

};

//# sourceMappingURL=_d3660a._.js.map