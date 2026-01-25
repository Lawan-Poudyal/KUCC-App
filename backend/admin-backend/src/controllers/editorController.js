export const editorAccess = async (req, res) => {
  res.json({
    success: true,
    role: req.admin.role,
    message: 'Editor access granted',
  });
};
