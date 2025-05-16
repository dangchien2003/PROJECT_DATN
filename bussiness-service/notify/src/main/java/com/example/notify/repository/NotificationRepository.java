package com.example.notify.repository;

import com.example.notify.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findAllByAccountId(String accountId, Pageable pageable);

    Long countAllByViewedAndAccountId(Integer viewed, String accountId);

    @Modifying
    @Query(value = """
            UPDATE Notification n set
                n.viewed = :viewed, n.modifiedAt = :now, n.modifiedBy = :actionBy
            where n.accountId = :accountId
            """)
    void readAllNotify(
            @Param("viewed") Integer viewed,
            @Param("accountId") String accountId,
            @Param("now") LocalDateTime now,
            @Param("actionBy") String actionBy
    );

    @Modifying
    @Query(value = """
            UPDATE Notification n set
                n.viewed = :viewed, n.modifiedAt = :now, n.modifiedBy = :actionBy
            where n.accountId = :actionBy and n.id = :id
            """)
    void readNotify(
            @Param("viewed") Integer viewed,
            @Param("id") Long id,
            @Param("now") LocalDateTime now,
            @Param("actionBy") String actionBy
    );

}
