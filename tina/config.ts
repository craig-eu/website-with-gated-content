import { defineConfig } from "tinacms";

// Your existing Tina Cloud credentials from .env.tina-cloud
const branch = process.env.TINA_BRANCH || "main";
const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const token = process.env.TINA_TOKEN;

// Check if we're in development mode - use local-only mode
// This avoids schema mismatch errors with Tina Cloud during development
const isLocalDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
    branch,

    // Only use Tina Cloud in production (when schema is synced)
    // During development, use local filesystem
    clientId: isLocalDevelopment ? undefined : clientId,
    token: isLocalDevelopment ? undefined : token,

    build: {
        outputFolder: "admin",
        publicFolder: "public",
    },

    media: {
        tina: {
            mediaRoot: "uploads",
            publicFolder: "public",
        },
    },

    // Schema configuration
    schema: {
        collections: [
            {
                name: "page",
                label: "Pages",
                path: "content/pages",
                format: "mdx",
                ui: {
                    router: ({ document }: any) => {
                        if (document._sys.filename === "home") {
                            return "/";
                        }
                        return `/${document._sys.filename}`;
                    },
                },
                fields: [
                    {
                        type: "string",
                        name: "title",
                        label: "Page Title",
                        required: true,
                        description: "The title of the page (used in browser tab and SEO)",
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Meta Description",
                        description: "SEO meta description (150-160 characters recommended)",
                        ui: {
                            component: "textarea",
                        },
                    },
                    {
                        type: "boolean",
                        name: "requiresAuth",
                        label: "Requires Authentication",
                        description: "If enabled, only logged-in users can view this page",
                        required: true,
                    },
                    {
                        type: "object",
                        name: "blocks",
                        label: "Page Blocks",
                        list: true,
                        templates: [
                            // Hero Block
                            {
                                name: "hero",
                                label: "Hero Section",
                                fields: [
                                    {
                                        type: "string",
                                        name: "headline",
                                        label: "Headline",
                                        required: true,
                                    },
                                    {
                                        type: "string",
                                        name: "subheadline",
                                        label: "Subheadline",
                                        ui: {
                                            component: "textarea",
                                        },
                                    },
                                    {
                                        type: "object",
                                        name: "primaryButton",
                                        label: "Primary Button",
                                        fields: [
                                            {
                                                type: "string",
                                                name: "text",
                                                label: "Button Text",
                                            },
                                            {
                                                type: "string",
                                                name: "url",
                                                label: "Button URL",
                                            },
                                        ],
                                    },
                                    {
                                        type: "object",
                                        name: "secondaryButton",
                                        label: "Secondary Button",
                                        fields: [
                                            {
                                                type: "string",
                                                name: "text",
                                                label: "Button Text",
                                            },
                                            {
                                                type: "string",
                                                name: "url",
                                                label: "Button URL",
                                            },
                                        ],
                                    },
                                    {
                                        type: "image",
                                        name: "backgroundImage",
                                        label: "Background Image",
                                    },
                                ],
                            },
                            // Features Block
                            {
                                name: "features",
                                label: "Features Grid",
                                fields: [
                                    {
                                        type: "string",
                                        name: "eyebrow",
                                        label: "Eyebrow Text",
                                        description: "Small text above the heading (e.g., 'Features')",
                                    },
                                    {
                                        type: "string",
                                        name: "heading",
                                        label: "Section Heading",
                                    },
                                    {
                                        type: "string",
                                        name: "subheading",
                                        label: "Section Subheading",
                                        ui: {
                                            component: "textarea",
                                        },
                                    },
                                    {
                                        type: "object",
                                        name: "items",
                                        label: "Feature Items",
                                        list: true,
                                        fields: [
                                            {
                                                type: "string",
                                                name: "icon",
                                                label: "Icon Name",
                                                description: "Lucide icon name (e.g., Shield, Zap, Globe)",
                                                required: true,
                                            },
                                            {
                                                type: "string",
                                                name: "title",
                                                label: "Feature Title",
                                                required: true,
                                            },
                                            {
                                                type: "string",
                                                name: "description",
                                                label: "Feature Description",
                                                ui: {
                                                    component: "textarea",
                                                },
                                            },
                                        ],
                                        ui: {
                                            itemProps: (item: any) => ({
                                                label: item?.title || "Feature Item",
                                            }),
                                        },
                                    },
                                ],
                            },
                            // Content Block
                            {
                                name: "content",
                                label: "Rich Content Section",
                                fields: [
                                    {
                                        type: "rich-text",
                                        name: "body",
                                        label: "Content",
                                        isBody: true,
                                    },
                                ],
                            },
                            // CTA Banner Block
                            {
                                name: "ctaBanner",
                                label: "Call-to-Action Banner",
                                fields: [
                                    {
                                        type: "string",
                                        name: "headline",
                                        label: "Headline",
                                        required: true,
                                    },
                                    {
                                        type: "string",
                                        name: "description",
                                        label: "Description",
                                        ui: {
                                            component: "textarea",
                                        },
                                    },
                                    {
                                        type: "object",
                                        name: "button",
                                        label: "Button",
                                        fields: [
                                            {
                                                type: "string",
                                                name: "text",
                                                label: "Button Text",
                                                required: true,
                                            },
                                            {
                                                type: "string",
                                                name: "url",
                                                label: "Button URL",
                                                required: true,
                                            },
                                        ],
                                    },
                                    {
                                        type: "string",
                                        name: "variant",
                                        label: "Color Variant",
                                        options: ["primary", "secondary", "dark"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
});
