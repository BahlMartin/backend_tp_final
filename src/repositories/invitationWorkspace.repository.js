import InvitationWorkspace from '../models/invitationWorkspace.model.js';

class InvitationWorkspaceRepository {
    async getInvitationByInvitedAndWorkspace(invited_user_id, workspace_id) {
        return await InvitationWorkspace.findOne({ fk_invited_user_id: invited_user_id, fk_workspace_id: workspace_id });
    }

    async create(inviter_user_id, invited_user_id, workspace_id, expiracion) {
        return await InvitationWorkspace.create({ fk_inviter_user_id: inviter_user_id, fk_invited_user_id: invited_user_id, fk_workspace_id: workspace_id, expiration_date: expiracion });
    }

    async updateInvitation(invitation_id, update_data) {
        return await InvitationWorkspace.findByIdAndUpdate(invitation_id, update_data);
    }

    async getAllInvitationByUser(user_id) {
        return await InvitationWorkspace.find({ fk_invited_user_id: user_id });
    }

    async getInvitationById(invitation_id) {
        return await InvitationWorkspace.findById(invitation_id);
    }
}

export const invitationWorkspaceRepository = new InvitationWorkspaceRepository();
export default invitationWorkspaceRepository;