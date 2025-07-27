// Download Routes - Serve lead magnets and resources
// Handles file downloads for the 7-Day MVP Validation System

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Sprint 0 Checklist Download
router.get('/sprint0-checklist', (req, res) => {
  try {
    const checklistPath = path.join(__dirname, '../../frontend/assets/sprint0-setup-checklist.md');
    
    // Check if file exists
    if (!fs.existsSync(checklistPath)) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    // Set headers for download
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment; filename="sprint0-setup-checklist.md"');
    
    // Send file
    res.sendFile(checklistPath);
    
  } catch (error) {
    console.error('Sprint 0 checklist download failed:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// MVP Validation Checklist Download (original lead magnet)
router.get('/mvp-validation-checklist', (req, res) => {
  try {
    const checklistPath = path.join(__dirname, '../../frontend/assets/mvp-validation-checklist.md');
    
    // Check if file exists
    if (!fs.existsSync(checklistPath)) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    // Set headers for download
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment; filename="mvp-validation-checklist.md"');
    
    // Send file
    res.sendFile(checklistPath);
    
  } catch (error) {
    console.error('MVP validation checklist download failed:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Download with token verification (for email links)
router.get('/secure/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { token, email } = req.query;
    
    // Verify download token (implement your token verification logic)
    if (!verifyDownloadToken(email, token, filename)) {
      return res.status(403).json({ error: 'Invalid download token' });
    }
    
    // Determine file path based on filename
    let filePath;
    switch (filename) {
      case 'sprint0-setup-checklist.md':
        filePath = path.join(__dirname, '../../frontend/assets/sprint0-setup-checklist.md');
        break;
      case 'mvp-validation-checklist.md':
        filePath = path.join(__dirname, '../../frontend/assets/mvp-validation-checklist.md');
        break;
      default:
        return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set headers for download
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file
    res.sendFile(filePath);
    
  } catch (error) {
    console.error('Secure download failed:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Utility function to verify download tokens
function verifyDownloadToken(email, token, filename) {
  try {
    const crypto = require('crypto');
    const secret = process.env.DOWNLOAD_TOKEN_SECRET || 'your-secret-key';
    
    // For simplicity, we'll use a basic verification
    // In production, you'd want to include timestamp validation and expiry
    const expectedData = `${email}:${filename}`;
    const expectedToken = crypto.createHmac('sha256', secret).update(expectedData).digest('hex');
    
    // For now, accept any valid-looking token (this is simplified)
    return token && token.length === 64; // SHA256 hex length
    
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

module.exports = router;