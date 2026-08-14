/**
 * Host half of the task-progress tray plugin. The tray is a pure browser
 * surface: the host apply is intentionally empty and exists only so the
 * plugin is a valid Loader entry on the host plane. The browser half ships
 * via exports["./client"] and is discovered through package.json's
 * dsh.client declaration.
 */
function apply() {}
export { apply };
