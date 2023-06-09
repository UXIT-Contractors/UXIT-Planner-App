'use client'

import React, { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'
import { Button } from '../../atoms'
import { useSession } from 'next-auth/react'
import { env } from '../../../../env/client.mjs'

export const WebPushButton = () => {
  const [pushEnabled, setPushEnabled] = useState<boolean>(false)
  const { data: sessionData, status } = useSession()
  const [oneSignalInitialized, setOneSignalInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (!oneSignalInitialized) {
      OneSignal.init({
        appId: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        safari_web_id: env.NEXT_PUBLIC_ONESIGNAL_SAFARI_KEY,
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        setOneSignalInitialized(true)
      }).catch((e) => {
        console.error(e)
      })
    }
  })

  useEffect(() => {
    if (oneSignalInitialized && status === "authenticated" && sessionData?.user?.id) {
      OneSignal.setExternalUserId(sessionData?.user?.id).catch((e) => {
        console.error(e)
      })
      OneSignal.isPushNotificationsEnabled((isEnabled) => {
        setPushEnabled(isEnabled)
      }).catch((e) => {
        console.error(e)
      })
    }
  }, [oneSignalInitialized, status, sessionData?.user?.id])

  useEffect(() => {
    if (oneSignalInitialized) {
      OneSignal.isPushNotificationsEnabled((isEnabled) => {
        setPushEnabled(isEnabled)
      }).catch((e) => {
        console.error(e)
      })
    }
  }, [oneSignalInitialized])

  const toggleNotifications = async () => {
    if (pushEnabled == false) {
      await OneSignal.registerForPushNotifications()
      await OneSignal.setSubscription(true)
    } else {
      await OneSignal.setSubscription(false)
    }
    OneSignal.isPushNotificationsEnabled((isEnabled) => {
      setPushEnabled(isEnabled)
    }).catch((e) => {
      console.error(e)
    })
  }


  return (
    <>
      <Button onPress={() => { toggleNotifications().catch((e) => console.error(e)) }} color={!pushEnabled ? "teal" : "red"}>{!pushEnabled ? 'Subscribe to Notifications' : 'Unsubscribe from Notifications'}</Button>
    </>
  )
}