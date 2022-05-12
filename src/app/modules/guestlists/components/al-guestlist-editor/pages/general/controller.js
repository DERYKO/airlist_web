import AbstractAlGuestlistEditorPagesController from '../../abstracts/abstract-page-controller';
import moment from 'moment';

export default class AlGuestlistEditorPageGeneralComponentController extends AbstractAlGuestlistEditorPagesController {

    constructor($injector, $scope) {
        super($injector, $scope);
        this.isPrivateGuestlist = false;
        this.dateFields = {
            start_date: null,
            end_date: null
        };
        this.currentUsers = [];
    }

    updateUserPermission(update, $index, permissions) {
        const newState = _.cloneDeep(this.state);

        if (update) {
            _.forEach(permissions, function (perm) {
                _.set(newState, `model.users.${$index}.permissions.${perm}`, true);
            });
        }

        this._updateState(newState);
    }

    /**
     * Opens popup to add new users to the guestlist permissions list
     */
    addUsers() {
        this.injector.get('SelectBox').single(this.injector.get('Users').reset({
            persists: false,
            listname: 'GuestlistPermissionUserSelectList'
        }), {
            displayField: 'master_user.full_name'
        }).then((selectedUserData) => {
            const present = _.filter(this.currentUsers, function (o) {
                return o.user.id === selectedUserData.data;
            });

            if (present.length === 0) {
                this.injector.get('User').get(selectedUserData.data).then((fullUser) => {
                    this.currentUsers.push({
                        user: fullUser,
                        permissions: {read: 1, write: 0, delete: 0, admin: 0}
                    });
                });
            } else {
                this.injector.get('Alert').warning(this.translate.instant(`guestlists.editor.pages.general.alert.user_already_exists_in_permissions_list`));
            }
        });
    }

    /**
     * Removes the specified user from the selected permissions
     *
     * @param userToDelete
     */
    removeUser(userToDelete) {
        const indexToDelete = this.currentUsers.indexOf(userToDelete);

        if (indexToDelete !== -1) {
            this.currentUsers.splice(indexToDelete, 1);
        }
    }

    _initWatchers() {
        super._initWatchers();
        this.scope.$watch(() => {
            return this.isPrivateGuestlist;
        }, () => {
            this.model.permission = this.isPrivateGuestlist ? 'private' : 'public';
        });

        this.scope.$watch(() => {
            return this.dateFields;
        }, () => {
            _.set(this.model, 'settings.start_date', this.dateFields.start_date ? this.transformDateFieldForModel(this.dateFields.start_date) : null);
            _.set(this.model, 'settings.end_date', this.dateFields.end_date ? this.transformDateFieldForModel(this.dateFields.end_date) : null);
        }, true);

        this.scope.$watch(() => {
            return this.currentUsers;
        }, () => {
            if (this.currentUsers.length > 0) {
                this.isPrivateGuestlist = true;
            }

            this.model.users = _.map(this.currentUsers, (information) => {
                return {
                    user: {
                        id: information.user.id
                    },
                    permissions: information.permissions
                }
            });
            if (this.model.users.length > 0) {
                this.isPrivateGuestlist = true;
            }
        }, true);
    }

    _initFormConfig() {
        this._updateState({
            ...this.state,
            formConfig: {
                ...this.state.formConfig,
                categorySelectBox: {
                    store: this.injector.get('Categories').reset({persist: false}),
                    displayField: 'name',
                    valueField: 'id',
                    maxItems: 15
                }
            }
        });
    }

    /**
     * @private
     */
    _fillModelFromGuestlist() {
        this.model = _.cloneDeep({
            name: this.getGuestlistValue('name'),
            settings: {
                start_date: null,
                end_date: null,
                location_information: {
                    name: this.getGuestlistValue('settings.location_information.name'),
                    street: this.getGuestlistValue('settings.location_information.street'),
                    zip: this.getGuestlistValue('settings.location_information.zip'),
                    city: this.getGuestlistValue('settings.location_information.city'),
                    country: this.getGuestlistValue('settings.location_information.country')
                },
                add_contacts_to_addressbook: this.getGuestlistValue('settings.add_contacts_to_addressbook'),
                identify_contact_by_email: this.getGuestlistValue('settings.identify_contact_by_email'),
                overwrite_data_of_email_identified_contact: this.getGuestlistValue('settings.overwrite_data_of_email_identified_contact')
            },
            permission: this.getGuestlistValue('permission'),
            users: []
        });

        if(this.guestlist.settings.start_date) {
            this.dateFields.start_date = this.transformDateForDateField(this.guestlist.settings.start_date);
        }

        if(this.guestlist.settings.end_date) {
            this.dateFields.end_date = this.transformDateForDateField(this.guestlist.settings.end_date);
        }

        this.currentUsers = this.getGuestlistValue('users');

        this.isPrivateGuestlist = this.model.permission === 'private';
    }
}
