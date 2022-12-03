import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
    IRead,
    IHttp,
    IPersistence,
    IModify
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { RoomTypeFilter, UIActionButtonContext } from '@rocket.chat/apps-engine/definition/ui';
import { IUIKitInteractionHandler,UIKitActionButtonInteractionContext, IUIKitResponse } from '@rocket.chat/apps-engine/definition/uikit';

export class UiKitApp extends App implements IUIKitInteractionHandler{
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configuration.ui.registerButton({
            actionId: 'my-action-id',
            context: UIActionButtonContext.MESSAGE_ACTION,
            labelI18n: 'my-action-name',
            when: {
                roomTypes:[
                    RoomTypeFilter.PUBLIC_CHANNEL,
                    RoomTypeFilter.PRIVATE_CHANNEL,
                    RoomTypeFilter.DIRECT
                ],
                // hasOnePermission: ['create-d'],
                // hasAllRoles: ['admin', 'moderator']
            }
        })
    }

    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        
        const {
            buttonContext, 
            actionId, 
            triggerId, 
            user, 
            room, 
            message,
        } = context.getInteractionData();

        if(actionId === 'my-action-id'){

            const blockBuilder = modify.getCreator().getBlockBuilder();

            return context.getInteractionResponder().openModalViewResponse({
                title: blockBuilder.newPlainTextObject('Interaction received'),
                blocks: blockBuilder.addSectionBlock({
                    text: blockBuilder.newPlainTextObject('We received your interaction, thanks!')
                }).getBlocks(),
            });
        }

        return context.getInteractionResponder().successResponse();
    }
    
}
