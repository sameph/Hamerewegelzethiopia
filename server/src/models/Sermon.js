const mongoose = require("mongoose");

const sermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    speaker: { type: String, required: true },
    series: { type: String, default: "" },
    type: { type: String, enum: ["video", "audio"], default: "video" },
    youtubeUrl: { type: String, default: "" }, // full YouTube URL
    youtubeId: { type: String, default: "" }, // extracted video ID
    duration: { type: String, default: "" }, // e.g. "45:30"
    description: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    language: { type: String, enum: ["am", "en", "both"], default: "am" },
    category: {
      type: String,
      enum: ["worship", "preaching", "teaching", "song", "prayer", "testimony"],
      default: "worship",
    },
    isDemo: { type: Boolean, default: false }, // marks demo/placeholder sermons
  },
  { timestamps: true }
);

// Auto-extract YouTube ID before save (async style — Mongoose 7+)
sermonSchema.pre("save", async function () {
  if (this.youtubeUrl) {
    const match = this.youtubeUrl.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
    );
    this.youtubeId = match ? match[1] : "";
  }
});

module.exports = mongoose.model("Sermon", sermonSchema);
