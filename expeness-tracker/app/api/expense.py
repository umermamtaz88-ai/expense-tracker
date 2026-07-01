"""Expense API routes."""

import logging
from datetime import date
from typing import Optional

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.services.expense_service import ExpenseNotFoundError, expense_service
from app.utils.response import error_response, success_response

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Expenses"])


@router.get("/categories")
def get_categories() -> JSONResponse:
    """Return all allowed expense categories."""
    categories = expense_service.get_categories()
    return success_response(data={"categories": categories})


@router.get("/expenses")
def list_expenses(
    category: Optional[str] = Query(default=None, description="Filter by category"),
    start_date: Optional[date] = Query(default=None, description="Filter from date"),
    end_date: Optional[date] = Query(default=None, description="Filter to date"),
) -> JSONResponse:
    """List all expenses with optional filters."""
    try:
        expenses = expense_service.get_all(
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
        data = [expense.model_dump(mode="json") for expense in expenses]
        return success_response(data={"expenses": data, "count": len(data)})
    except Exception as exc:
        logger.warning("Error listing expenses: %s", exc)
        return error_response(message=str(exc), status_code=400)


@router.get("/expenses/{expense_id}")
def get_expense(expense_id: str) -> JSONResponse:
    """Retrieve a single expense by ID."""
    try:
        expense = expense_service.get_by_id(expense_id)
        return success_response(data=expense.model_dump(mode="json"))
    except ExpenseNotFoundError as exc:
        return error_response(message=str(exc), status_code=404)


@router.post("/expenses", status_code=201)
def create_expense(payload: ExpenseCreate) -> JSONResponse:
    """Create a new expense."""
    expense = expense_service.create(payload)
    return success_response(
        data=expense.model_dump(mode="json"),
        message="Expense created successfully",
        status_code=201,
    )


@router.put("/expenses/{expense_id}")
def update_expense(expense_id: str, payload: ExpenseUpdate) -> JSONResponse:
    """Update an existing expense."""
    try:
        expense = expense_service.update(expense_id, payload)
        return success_response(
            data=expense.model_dump(mode="json"),
            message="Expense updated successfully",
        )
    except ExpenseNotFoundError as exc:
        return error_response(message=str(exc), status_code=404)


@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: str) -> JSONResponse:
    """Delete an expense by ID."""
    try:
        expense_service.delete(expense_id)
        return success_response(message="Expense deleted successfully", data=None)
    except ExpenseNotFoundError as exc:
        return error_response(message=str(exc), status_code=404)


@router.get("/summary")
def get_summary() -> JSONResponse:
    """Return overall expense summary."""
    summary = expense_service.get_summary()
    return success_response(data=summary.model_dump(mode="json"))


@router.get("/summary/month")
def get_summary_by_month() -> JSONResponse:
    """Return expense summary grouped by month."""
    summary = expense_service.get_summary_by_month()
    data = [item.model_dump(mode="json") for item in summary]
    return success_response(data={"months": data, "count": len(data)})


@router.get("/summary/category")
def get_summary_by_category() -> JSONResponse:
    """Return expense summary grouped by category."""
    summary = expense_service.get_summary_by_category()
    data = [item.model_dump(mode="json") for item in summary]
    return success_response(data={"categories": data, "count": len(data)})
