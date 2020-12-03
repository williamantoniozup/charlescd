package io.charlescd.moove.infrastructure

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.CircleRepository
import org.springframework.stereotype.Repository
import java.time.Duration
import java.util.*

@Repository
class JdbcCircleTwoRepository : CircleRepository {
    override fun save(circle: Circle): Circle {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun update(circle: Circle): Circle {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun delete(id: String) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun findById(id: String): Optional<Circle> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun find(id: String, workspaceId: String): Optional<Circle> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun find(name: String?, active: Boolean?, workspaceId: String, pageRequest: PageRequest): Page<Circle> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun findDefaultByWorkspaceId(workspaceId: String): Optional<Circle> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun countGroupedByStatus(workspaceId: String): List<CircleCount> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun countGroupedByStatus(workspaceId: String, name: String?): List<CircleCount> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getNotDefaultCirclesAverageLifeTime(workspaceId: String): Duration {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun findCirclesHistory(workspaceId: String, name: String?, pageRequest: PageRequest): Page<CircleHistory> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun count(workspaceId: String): Int {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun count(workspaceId: String, name: String?): Int {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}
