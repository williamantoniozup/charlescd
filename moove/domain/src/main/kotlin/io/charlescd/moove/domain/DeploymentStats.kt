package io.charlescd.moove.domain

import java.time.Duration
import java.time.LocalDate

data class DeploymentStats(
    val total: Int,
    val deploymentStatus: DeploymentStatusEnum,
    val averageTime: Duration,
    val date: LocalDate
)
