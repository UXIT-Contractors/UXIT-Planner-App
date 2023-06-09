import * as OneSignal from '@onesignal/node-onesignal'
export * as OneSignal from '@onesignal/node-onesignal'
import { env } from '../env/server.mjs'

const user_key_provider = {
  getToken() {
    //MOVE TO ENV
    return env.ONESIGNAL_USER_KEY
  }
}

const app_key_provider = {
  getToken() {
    //MOVE TO ENV
    return env.ONESIGNAL_APP_API_KEY
  }
}

const configuration = OneSignal.createConfiguration({
  authMethods: {
    user_key: {
      tokenProvider: user_key_provider
    },
    app_key: {
      tokenProvider: app_key_provider
    }
  }
})

const globalForNotifications = globalThis as unknown as { client: OneSignal.DefaultApi }

const sendNotificationToUser = ({ user_ids, message, callbackURL }: { user_ids: string[], message: string, callbackURL?: string }) => {
  const notification = new OneSignal.Notification()
  notification.app_id = env.ONESIGNAL_APP_ID
  notification.channel_for_external_user_ids = "push"
  notification.headings = {
    en: "Pulchri Planner"
  }
  notification.small_icon = env.NEXTAUTH_URL + "/icon-192x192.png"

  notification.include_external_user_ids = user_ids
  notification.contents = {
    en: message
  }
  if (callbackURL) {
    notification.web_url = callbackURL
  }

  return globalForNotifications.client.createNotification(notification)
}

const getNotificationsOfUser = async (user_id: string) => {
  const notifications = await globalForNotifications.client.getNotifications(
    env.ONESIGNAL_APP_ID
  )
  return notifications.notifications?.filter(notification => notification.include_external_user_ids?.includes(user_id))
}

const deleteNotificationForUser = async (notification_id: string, user_id: string) => {
  const notification = await globalForNotifications.client.getNotification(
    env.ONESIGNAL_APP_ID,
    notification_id
  )
  if (notification.include_external_user_ids?.includes(user_id)) {
    return globalForNotifications.client.cancelNotification(
      env.ONESIGNAL_APP_ID,
      notification_id
    )
  }
}

export const notificationService = {
  client: globalForNotifications.client || new OneSignal.DefaultApi(configuration),
  sendNotificationToUser: sendNotificationToUser,
  getNotificationsOfUser: getNotificationsOfUser,
  deleteNotificationForUser: deleteNotificationForUser
}



if (process.env.NODE_ENV !== "production") globalForNotifications.client = notificationService.client
