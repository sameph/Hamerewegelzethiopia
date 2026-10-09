const Sermon = require('../models/Sermon');

// Helper to extract YouTube ID from URL
function extractYoutubeId(url) {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : '';
}

// @desc    Get all sermons
// @route   GET /api/v1/sermons
// @access  Public
exports.getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: sermons.length, data: sermons });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single sermon
// @route   GET /api/v1/sermons/:id
// @access  Public
exports.getSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, error: 'Sermon not found' });
    }
    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new sermon
// @route   POST /api/v1/sermons
// @access  Private (Admin)
exports.createSermon = async (req, res) => {
  try {
    // Extract YouTube ID if not already set
    if (req.body.youtubeUrl && !req.body.youtubeId) {
      req.body.youtubeId = extractYoutubeId(req.body.youtubeUrl);
    }
    const sermon = await Sermon.create(req.body);
    res.status(201).json({ success: true, data: sermon });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update sermon
// @route   PUT /api/v1/sermons/:id
// @access  Private (Admin)
exports.updateSermon = async (req, res) => {
  try {
    if (req.body.youtubeUrl) {
      req.body.youtubeId = extractYoutubeId(req.body.youtubeUrl);
    }
    let sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, error: 'Sermon not found' });
    }
    sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete sermon
// @route   DELETE /api/v1/sermons/:id
// @access  Private (Admin)
exports.deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, error: 'Sermon not found' });
    }
    await sermon.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
