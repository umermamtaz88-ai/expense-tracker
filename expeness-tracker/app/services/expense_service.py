"""Business logic for expense management."""

import logging
import uuid
from collections import defaultdict
from datetime import date
from typing import Optional

from app.constants.categories import ALLOWED_CATEGORIES
from app.database.database import get_expenses_raw, save_expenses_raw
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    SummaryByCategory,
    SummaryByMonth,
    SummaryOverall,
)

logger = logging.getLogger(__name__)


class ExpenseNotFoundError(Exception):
    """Raised when an expense with the given ID does not exist."""

    def __init__(self, expense_id: str) -> None:
        self.expense_id = expense_id
        super().__init__(f"Expense with id '{expense_id}' not found")


class ExpenseService:
    """Service layer encapsulating expense CRUD and summary operations."""

    @staticmethod
    def _deserialize(raw_expenses: list[dict]) -> list[Expense]:
        return [Expense.model_validate(item) for item in raw_expenses]

    @staticmethod
    def _serialize(expense: Expense) -> dict:
        return expense.model_dump(mode="json")

    def get_categories(self) -> list[str]:
        """Return all allowed expense categories."""
        return list(ALLOWED_CATEGORIES)

    def get_all(
        self,
        category: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> list[Expense]:
        """Retrieve all expenses with optional filters."""
        expenses = self._deserialize(get_expenses_raw())

        if category:
            expenses = [e for e in expenses if e.category == category]
        if start_date:
            expenses = [e for e in expenses if e.date >= start_date]
        if end_date:
            expenses = [e for e in expenses if e.date <= end_date]

        expenses.sort(key=lambda e: (e.date, e.id), reverse=True)
        logger.debug("Retrieved %d expenses", len(expenses))
        return expenses

    def get_by_id(self, expense_id: str) -> Expense:
        """Retrieve a single expense by ID."""
        for expense in self._deserialize(get_expenses_raw()):
            if expense.id == expense_id:
                return expense
        raise ExpenseNotFoundError(expense_id)

    def create(self, payload: ExpenseCreate) -> Expense:
        """Create a new expense record."""
        raw_expenses = get_expenses_raw()
        expense = Expense(
            id=str(uuid.uuid4()),
            **payload.model_dump(),
        )
        raw_expenses.append(self._serialize(expense))
        save_expenses_raw(raw_expenses)
        logger.info("Created expense id=%s title=%s", expense.id, expense.title)
        return expense

    def update(self, expense_id: str, payload: ExpenseUpdate) -> Expense:
        """Update an existing expense (partial update supported)."""
        raw_expenses = get_expenses_raw()
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            return self.get_by_id(expense_id)

        for index, item in enumerate(raw_expenses):
            if item.get("id") == expense_id:
                updated = Expense.model_validate({**item, **update_data})
                raw_expenses[index] = self._serialize(updated)
                save_expenses_raw(raw_expenses)
                logger.info("Updated expense id=%s", expense_id)
                return updated

        raise ExpenseNotFoundError(expense_id)

    def delete(self, expense_id: str) -> None:
        """Delete an expense by ID."""
        raw_expenses = get_expenses_raw()
        filtered = [item for item in raw_expenses if item.get("id") != expense_id]

        if len(filtered) == len(raw_expenses):
            raise ExpenseNotFoundError(expense_id)

        save_expenses_raw(filtered)
        logger.info("Deleted expense id=%s", expense_id)

    def get_summary(self) -> SummaryOverall:
        """Return overall expense statistics."""
        expenses = self._deserialize(get_expenses_raw())
        total = len(expenses)
        total_amount = sum(e.amount for e in expenses)
        average = total_amount / total if total > 0 else 0.0

        return SummaryOverall(
            total_expenses=total,
            total_amount=round(total_amount, 2),
            average_amount=round(average, 2),
        )

    def get_summary_by_month(self) -> list[SummaryByMonth]:
        """Return expense totals grouped by year-month."""
        expenses = self._deserialize(get_expenses_raw())
        monthly: dict[str, dict[str, float | int]] = defaultdict(
            lambda: {"total_amount": 0.0, "expense_count": 0}
        )

        for expense in expenses:
            key = expense.date.strftime("%Y-%m")
            monthly[key]["total_amount"] += expense.amount
            monthly[key]["expense_count"] += 1

        return [
            SummaryByMonth(
                month=month,
                total_amount=round(data["total_amount"], 2),
                expense_count=int(data["expense_count"]),
            )
            for month, data in sorted(monthly.items(), reverse=True)
        ]

    def get_summary_by_category(self) -> list[SummaryByCategory]:
        """Return expense totals grouped by category with percentages."""
        expenses = self._deserialize(get_expenses_raw())
        by_category: dict[str, dict[str, float | int]] = defaultdict(
            lambda: {"total_amount": 0.0, "expense_count": 0}
        )

        for expense in expenses:
            by_category[expense.category]["total_amount"] += expense.amount
            by_category[expense.category]["expense_count"] += 1

        grand_total = sum(e.amount for e in expenses)

        results = [
            SummaryByCategory(
                category=category,
                total_amount=round(data["total_amount"], 2),
                expense_count=int(data["expense_count"]),
                percentage=round(
                    (data["total_amount"] / grand_total * 100) if grand_total else 0.0,
                    2,
                ),
            )
            for category, data in by_category.items()
        ]
        results.sort(key=lambda item: item.total_amount, reverse=True)
        return results


expense_service = ExpenseService()
