import { api } from "../../../utils/api"
import { LoadingMessage } from "../generic/loading-message"
import { CardList } from "../../atoms/layout/card/card-list"
import { StaffingCard } from "./staffing-card"
import type { StaffingWithColleagues } from "../../../types/StaffingWithColleagues"
import { Button } from "../../atoms/input/button"
import React from 'react'
import type { Shift, Shift_Type, Staffing } from "@prisma/client"

export function PersonalStaffingList({ fromDate }: { fromDate?: Date }) {
  const personalStaffings = api.staffing.getPersonalStaffing.useInfiniteQuery({ fromDate, limit: 10 }, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor
    }
  })

  if (personalStaffings.isLoading) {
    return <LoadingMessage />
  }

  if (personalStaffings.error) {
    return <div>
      {personalStaffings.error.message}
    </div>
  }

  const staffings = personalStaffings.data?.pages.flatMap(({ items }: {
    items: (Staffing & {
      shift: Shift & {
        staffings: (Staffing & {
          user: {
            id: string
            name: string | null
          }
          shift_type: Shift_Type
        })[]
      }
      shift_type: Shift_Type
    })[]
  }) => items)

  return (
    <div className="flex flex-col items-center gap-4">
      <CardList<StaffingWithColleagues> objects={staffings} CardLayout={
        (staffing) => {
          return <StaffingCard staffing={staffing} />
        }
      } />
      {personalStaffings.hasNextPage && <Button onPress={() => void personalStaffings.fetchNextPage()}>Load more</Button>}
      {staffings?.length === 0 && <p className="m-4 text-center">Je hebt nog geen toekomstige diensten staan.</p>}
    </div>
  )
}
