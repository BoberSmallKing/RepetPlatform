from django.db import models
from apps.relations.models import TutorStudentRelation


class Month(models.Model):
    class MonthChoices(models.IntegerChoices):
        JAN = 1, "Январь"
        FEB = 2, "Февраль"
        MAR = 3, "Март"
        APR = 4, "Апрель"
        MAY = 5, "Май"
        JUN = 6, "Июнь"
        JUL = 7, "Июль"
        AUG = 8, "Август"
        SEP = 9, "Сентябрь"
        OCT = 10, "Октябрь"
        NOV = 11, "Ноябрь"
        DEC = 12, "Декабрь"

    relation = models.ForeignKey(
        TutorStudentRelation,
        on_delete=models.CASCADE,
        related_name="months"
    )

    month = models.IntegerField(choices=MonthChoices.choices)
    year = models.IntegerField()

    title = models.CharField(max_length=100, blank=True)
    month_target = models.CharField(max_length=200, blank=True)

    image = models.ImageField(upload_to="months/", default="months/default.jpg", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("relation", "month", "year")
        ordering = ["year", "month"]

    def __str__(self):
        return f"{self.relation} — {self.month}/{self.year}"
